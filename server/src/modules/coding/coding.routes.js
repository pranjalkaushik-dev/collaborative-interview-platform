const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { runCode, submitCode, getSupportedLanguages } = require('./coding.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

router.get('/languages', getSupportedLanguages);
router.post('/run', runCode);
router.post('/submit', authMiddleware, submitCode);
=======
const { runCode, getSupportedLanguages } = require('./coding.controller');

// Public or authenticated code execution
router.post('/run', runCode);
router.get('/languages', getSupportedLanguages);
>>>>>>> origin/feature/collaborative-coding

module.exports = router;
