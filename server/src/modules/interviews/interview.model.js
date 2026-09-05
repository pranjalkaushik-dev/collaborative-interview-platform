const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['INTERVIEWER', 'CANDIDATE'],
    required: true
  },
  inviteStatus: {
    type: String,
    enum: ['INVITED', 'JOINED', 'DECLINED', 'LEFT'],
    default: 'JOINED'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  leftAt: {
    type: Date,
    default: null
  }
});

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Interview title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      default: ''
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interviewType: {
      type: String,
      enum: ['CODING', 'TECHNICAL', 'HR', 'MIXED'],
      default: 'TECHNICAL'
    },
    scheduledAt: {
      type: Date,
      default: Date.now
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: 15,
      max: 180
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED'
    },
    participants: [participantSchema],
    settings: {
      requireFullscreen: { type: Boolean, default: true },
      allowCopyPaste: { type: Boolean, default: false },
      enableCameraPrototype: { type: Boolean, default: false },
      maxViolations: { type: Number, default: 3 }
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
