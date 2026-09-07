import { io } from 'socket.io-client';

let socket = null;

export const initSocket = ({ serverUrl = 'http://localhost:5000', token = null, userName = 'Nitesh (Lead)', role = 'INTERVIEWER' } = {}) => {
  if (socket && socket.connected) {
    return socket;
  }

  const authPayload = token
    ? { token }
    : {
        isGuest: true,
        userName,
        role,
        userId: `user_${Math.random().toString(36).substring(2, 8)}`
      };

  socket = io(serverUrl, {
    auth: authPayload,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server successfully with ID:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket Connection Error]:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const joinRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit('join-room', { roomId });
  }
};

export const emitCodeChange = (roomId, code) => {
  if (socket && socket.connected) {
    socket.emit('code-change', { roomId, code });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
