const Interview = require('./interview.model');
const { sendSuccess, sendError } = require('../../shared/utils/response.utils');
const crypto = require('crypto');

/**
 * Helper to generate random 6-character room code (e.g. INT-8X9Y)
 */
const generateRoomCode = () => {
  return 'INT-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * @desc    Create a new Interview Room (Interviewer only)
 * @route   POST /api/interviews
 * @access  Private (Interviewer)
 */
const createInterview = async (req, res) => {
  try {
    const { title, description, interviewType, durationMinutes, settings } = req.body;

    if (!title) {
      return sendError(res, 400, 'Interview title is required');
    }

    const roomCode = generateRoomCode();

    const interview = await Interview.create({
      title,
      description,
      roomCode,
      createdBy: req.user._id,
      interviewType: interviewType || 'TECHNICAL',
      durationMinutes: durationMinutes || 60,
      participants: [
        {
          user: req.user._id,
          role: 'INTERVIEWER',
          inviteStatus: 'JOINED'
        }
      ],
      settings: settings || {}
    });

    return sendSuccess(res, 201, 'Interview room created successfully', {
      interview
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @desc    Get all interviews for logged in user
 * @route   GET /api/interviews
 * @access  Private
 */
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      $or: [
        { createdBy: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
      .populate('createdBy', 'fullName email avatarUrl')
      .populate('participants.user', 'fullName email avatarUrl accountRole')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Interviews retrieved successfully', {
      count: interviews.length,
      interviews
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @desc    Get Interview details by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('createdBy', 'fullName email avatarUrl')
      .populate('participants.user', 'fullName email avatarUrl accountRole');

    if (!interview) {
      return sendError(res, 404, 'Interview room not found');
    }

    return sendSuccess(res, 200, 'Interview details retrieved', {
      interview
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @desc    Join Interview via Room Code
 * @route   POST /api/interviews/join
 * @access  Private
 */
const joinInterviewByCode = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return sendError(res, 400, 'Please provide a valid room code');
    }

    const interview = await Interview.findOne({ roomCode: roomCode.toUpperCase() });

    if (!interview) {
      return sendError(res, 404, 'No active interview room found with this code');
    }

    // Check if candidate is already in participants
    const alreadyParticipant = interview.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (!alreadyParticipant) {
      interview.participants.push({
        user: req.user._id,
        role: req.user.accountRole,
        inviteStatus: 'JOINED',
        joinedAt: new Date()
      });

      if (interview.status === 'SCHEDULED') {
        interview.status = 'LIVE';
        interview.startedAt = new Date();
      }

      await interview.save();
    }

    return sendSuccess(res, 200, 'Successfully joined interview room', {
      interview
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  joinInterviewByCode
};
