const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./shared/middlewares/error.middleware');
const { verifyToken } = require('./shared/utils/jwt.utils');
const User = require('./modules/auth/auth.model');
const ViolationLog = require('./modules/monitoring/violation.model');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const interviewRoutes = require('./modules/interviews/interview.routes');
const monitoringRoutes = require('./modules/monitoring/monitoring.routes');
const codingRoutes = require('./modules/coding/coding.routes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Collaborative Technical Interview Backend',
    team: 'Batch B-2 (NIE Mysuru)'
  });
});

// Mount REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/coding', codingRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// In-memory room state for real-time live code syncing
const roomCodeMap = new Map();
const roomUsersMap = new Map();

// Socket.IO Authentication Middleware (Secures all socket events)
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      if (socket.handshake.auth?.pairingToken) {
        const decoded = verifyToken(socket.handshake.auth.pairingToken);
        socket.user = { _id: decoded.candidateId, role: 'SECONDARY_CAM' };
        socket.isDualCam = true;
        return next();
      }

      // Allow guest/testing connections for live collaborative coding
      const guestName = socket.handshake.auth?.userName || `Developer-${socket.id.slice(0, 4)}`;
      socket.user = {
        _id: socket.handshake.auth?.userId || `guest_${socket.id.slice(0, 6)}`,
        fullName: guestName,
        accountRole: socket.handshake.auth?.role || 'CANDIDATE',
        isActive: true
      };
      return next();
    }

    const decoded = verifyToken(token);
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      // Offline fallback
    }

    if (!user) {
      user = {
        _id: decoded.id || `user_${socket.id.slice(0, 6)}`,
        fullName: decoded.fullName || 'Interview Participant',
        accountRole: decoded.accountRole || 'CANDIDATE',
        isActive: true
      };
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Token validation failed'));
  }
});

// Socket.IO Gateway & Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Connected User: ${socket.user?.fullName || 'SecondaryCam'} (${socket.id})`);

  // 1. Join Interview Room
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    socket.currentRoom = roomId;

    // Track active room participants
    if (!roomUsersMap.has(roomId)) {
      roomUsersMap.set(roomId, new Map());
    }
    roomUsersMap.get(roomId).set(socket.id, {
      socketId: socket.id,
      userId: socket.user?._id,
      userName: socket.user?.fullName,
      role: socket.user?.accountRole || 'CANDIDATE'
    });

    const participants = Array.from(roomUsersMap.get(roomId).values());

    console.log(`[Socket.IO] ${socket.user?.fullName} (${socket.id}) joined room: ${roomId}`);
    
    // Broadcast to room members
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userId: socket.user?._id,
      userName: socket.user?.fullName,
      role: socket.user?.accountRole || 'CANDIDATE',
      participants
    });

    // Send the joining user current room state (latest synced code & participants)
    const existingCode = roomCodeMap.get(roomId);
    socket.emit('room-state', {
      code: existingCode !== undefined ? existingCode : null,
      participants
    });
  });

  // 2. Code Synchronization (Nitesh's module)
  socket.on('code-change', ({ roomId, code }) => {
    roomCodeMap.set(roomId, code);
    socket.to(roomId).emit('code-update', { code });
  });

  // 3. SECURE CV & Monitoring Violations (Rishav's module)
  socket.on('monitoring:violation', async ({ interviewId, violationType, metadata, severity }) => {
    try {
      const candidateId = socket.user._id;

      const violationLog = await ViolationLog.create({
        interviewId,
        candidateId,
        violationType,
        metadata: metadata || {},
        severity: severity || 'MEDIUM'
      });

      const totalViolations = await ViolationLog.countDocuments({
        interviewId,
        candidateId
      });

      console.warn(
        `[CV Violation Persisted] Room ${interviewId}: Candidate ${socket.user.fullName} - ${violationType} (Total: ${totalViolations})`
      );

      io.to(interviewId).emit('violation-alert', {
        logId: violationLog._id,
        candidateId,
        candidateName: socket.user.fullName,
        violationType,
        metadata,
        severity: violationLog.severity,
        totalViolations,
        timestamp: violationLog.timestamp
      });
    } catch (err) {
      console.error('[Socket Violation Error]:', err.message);
      socket.emit('error-event', { message: 'Failed to record violation log' });
    }
  });

  // 4. Laptop <-> Phone Dual-Camera WebRTC Signaling (Rishav's module)
  socket.on('dual-camera:join', ({ interviewId }) => {
    socket.join(`dual-cam-${interviewId}`);
    console.log(`[Dual-Cam Socket] Secondary device joined dual-cam-${interviewId}`);
    socket.to(interviewId).emit('dual-camera:joined', {
      socketId: socket.id,
      candidateId: socket.user?._id,
      deviceType: 'SECONDARY_CAM'
    });
  });

  socket.on('dual-camera:offer', ({ interviewId, sdp, targetSocketId }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit('dual-camera:offer', { sdp, senderSocketId: socket.id });
    } else {
      socket.to(interviewId).emit('dual-camera:offer', { sdp, senderSocketId: socket.id });
    }
  });

  socket.on('dual-camera:answer', ({ interviewId, sdp, targetSocketId }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit('dual-camera:answer', { sdp, senderSocketId: socket.id });
    } else {
      socket.to(interviewId).emit('dual-camera:answer', { sdp, senderSocketId: socket.id });
    }
  });

  socket.on('dual-camera:ice-candidate', ({ interviewId, candidate, targetSocketId }) => {
    if (targetSocketId) {
      io.to(targetSocketId).emit('dual-camera:ice-candidate', { candidate, senderSocketId: socket.id });
    } else {
      socket.to(interviewId).emit('dual-camera:ice-candidate', { candidate, senderSocketId: socket.id });
    }
  });

  socket.on('dual-camera:leave', ({ interviewId }) => {
    socket.to(interviewId).emit('dual-camera:left', { socketId: socket.id, reason: 'DEVICE_DISCONNECTED' });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client Disconnected: ${socket.id}`);
    if (socket.currentRoom && roomUsersMap.has(socket.currentRoom)) {
      roomUsersMap.get(socket.currentRoom).delete(socket.id);
      const participants = Array.from(roomUsersMap.get(socket.currentRoom).values());
      socket.to(socket.currentRoom).emit('user-left', {
        socketId: socket.id,
        userName: socket.user?.fullName,
        participants
      });
    }
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Collaborative Interview Platform Backend Server Live`);
  console.log(`📡 Listening on Port: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
