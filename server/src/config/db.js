const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collaborative_interview_db', {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB Connection Failed: ${error.message}`);
    console.warn(`[Database Warning] Server running in offline/in-memory mode for Socket.IO and live collaboration.`);
  }
};

module.exports = connectDB;
