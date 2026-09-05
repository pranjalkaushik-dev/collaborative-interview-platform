const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./shared/middlewares/error.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const interviewRoutes = require('./modules/interviews/interview.routes');

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

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`[Socket.IO] New Client Connected: ${socket.id}`);

  // Join Interview Room
  socket.on('join-room', ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`[Socket.IO] User ${userName} (${socket.id}) joined room: ${roomId}`);
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userName });
  });

  // Code Synchronization (Nitesh's module)
  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', { code });
  });

  // Monitoring Violations (Rishav's module)
  socket.on('monitoring:violation', ({ roomId, candidateId, violationType }) => {
    console.warn(`[Violation Warning] Room ${roomId}: Candidate ${candidateId} - ${violationType}`);
    io.to(roomId).emit('violation-alert', { candidateId, violationType, timestamp: Date.now() });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client Disconnected: ${socket.id}`);
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
