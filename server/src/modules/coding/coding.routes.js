const express = require('express');
const router = express.Router();

const {
  runCode,
  submitCode,
  getSupportedLanguages
} = require('./coding.controller');

const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.get('/languages', getSupportedLanguages);
router.post('/run', runCode);
router.post('/submit', authMiddleware, submitCode);

module.exports = router;
