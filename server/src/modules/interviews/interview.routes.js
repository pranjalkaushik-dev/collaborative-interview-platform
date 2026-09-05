const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviews,
  getInterviewById,
  joinInterviewByCode
} = require('./interview.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const authorizeRoles = require('../../shared/middlewares/role.middleware');

router.use(authMiddleware);

router.post('/', authorizeRoles('INTERVIEWER'), createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.post('/join', joinInterviewByCode);

module.exports = router;
