const express = require('express');
const router = express.Router();
const { runCode, getSupportedLanguages } = require('./coding.controller');

// Public or authenticated code execution
router.post('/run', runCode);
router.get('/languages', getSupportedLanguages);

module.exports = router;
