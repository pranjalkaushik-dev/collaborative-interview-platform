<<<<<<< HEAD
const Submission = require('./submission.model');
const Interview = require('../interviews/interview.model');
=======
/**
 * Coding Controller - Judge0 Code Execution
 * Lead: Nitesh (Code Editor & Execution Lead)
 */
>>>>>>> origin/feature/collaborative-coding
const { sendSuccess, sendError } = require('../../shared/utils/response.utils');

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || null;

const decodeBase64 = (str) => {
  if (!str) return '';
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (e) {
    return str;
  }
};

/**
 * Execute code using Judge0 compiler API with Base64 encoding
 * POST /api/coding/run
 */
const runCode = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin } = req.body;

    if (!sourceCode || !languageId) {
      return sendError(res, 400, 'sourceCode and languageId are required');
    }

<<<<<<< HEAD
    const headers = { 'Content-Type': 'application/json' };
=======
    const headers = {
      'Content-Type': 'application/json'
    };

>>>>>>> origin/feature/collaborative-coding
    if (JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

<<<<<<< HEAD
=======
    // Base64 encode source code and stdin to support all UTF-8 characters and GCC symbols safely
>>>>>>> origin/feature/collaborative-coding
    const encodedSource = Buffer.from(sourceCode, 'utf-8').toString('base64');
    const encodedStdin = stdin ? Buffer.from(stdin, 'utf-8').toString('base64') : '';

    const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: encodedSource,
        language_id: Number(languageId),
        stdin: encodedStdin
      })
    });

    if (!response.ok) {
<<<<<<< HEAD
      const errorText = await response.text();
      return sendError(res, response.status, 'Judge0 execution error', errorText);
=======
      const errText = await response.text();
      return sendError(res, response.status, `Judge0 execution failed: ${errText}`);
>>>>>>> origin/feature/collaborative-coding
    }

    const result = await response.json();

    const stdout = decodeBase64(result.stdout);
    const stderr = decodeBase64(result.stderr);
    const compileOutput = decodeBase64(result.compile_output);

    return sendSuccess(res, 200, 'Code executed successfully', {
      stdout,
      stderr,
      compileOutput,
      status: result.status || {},
      time: result.time || '0.0',
      memory: result.memory || 0,
<<<<<<< HEAD
      exitCode: result.exit_code
    });
  } catch (error) {
    return sendError(res, 500, error.message);
=======
      exitCode: result.exit_code,
      exitSignal: result.exit_signal
    });
  } catch (error) {
    console.error('[Judge0 Execution Error]:', error.message);
    return sendError(res, 500, `Execution server error: ${error.message}`);
>>>>>>> origin/feature/collaborative-coding
  }
};

/**
<<<<<<< HEAD
 * Submit code for final evaluation, store in MongoDB, and attach to AI Pipeline
 * POST /api/coding/submit
 */
const submitCode = async (req, res) => {
  try {
    const {
      interviewId,
      questionId,
      sourceCode,
      languageId,
      languageName,
      testResults,
      aiFeedback
    } = req.body;

    if (!interviewId || !sourceCode || !languageId) {
      return sendError(res, 400, 'interviewId, sourceCode, and languageId are required');
    }

    const candidateId = req.user._id;

    // Calculate score based on passed test cases
    let score = 100;
    let status = 'PASSED';

    if (Array.isArray(testResults) && testResults.length > 0) {
      const passedCount = testResults.filter((t) => t.passed).length;
      score = Math.round((passedCount / testResults.length) * 100);
      if (score === 100) {
        status = 'PASSED';
      } else if (score > 0) {
        status = 'PARTIAL';
      } else {
        status = 'FAILED';
      }
    }

    // Persist submission to MongoDB
    const submission = await Submission.create({
      interviewId,
      questionId: questionId || null,
      candidateId,
      sourceCode,
      languageId: Number(languageId),
      languageName: languageName || 'javascript',
      status,
      score,
      testResults: testResults || [],
      aiFeedback: aiFeedback || {}
    });

    return sendSuccess(res, 201, 'Code submission saved successfully', {
      submissionId: submission._id,
      interviewId: submission.interviewId,
      questionId: submission.questionId,
      candidateId: submission.candidateId,
      sourceCode: submission.sourceCode,
      languageId: submission.languageId,
      status: submission.status,
      score: submission.score,
      testResults: submission.testResults,
      aiFeedback: submission.aiFeedback,
      submittedAt: submission.submittedAt
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * Get supported Judge0 language IDs
=======
 * Supported Language Mapping
>>>>>>> origin/feature/collaborative-coding
 * GET /api/coding/languages
 */
const getSupportedLanguages = (req, res) => {
  const languages = [
<<<<<<< HEAD
    { id: 71, name: 'Python (3.8.1)' },
    { id: 54, name: 'C++ (GCC 9.2.0)' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
    { id: 73, name: 'Rust (1.40.0)' },
    { id: 60, name: 'Go (1.13.5)' }
=======
    { id: 71, name: 'Python (3.8.1)', monacoLang: 'python', extension: 'py' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)', monacoLang: 'javascript', extension: 'js' },
    { id: 74, name: 'TypeScript (3.7.4)', monacoLang: 'typescript', extension: 'ts' },
    { id: 54, name: 'C++ (GCC 9.2.0)', monacoLang: 'cpp', extension: 'cpp' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)', monacoLang: 'java', extension: 'java' },
    { id: 50, name: 'C (GCC 9.2.0)', monacoLang: 'c', extension: 'c' }
>>>>>>> origin/feature/collaborative-coding
  ];

  return sendSuccess(res, 200, 'Supported languages retrieved', { languages });
};

module.exports = {
  runCode,
<<<<<<< HEAD
  submitCode,
=======
>>>>>>> origin/feature/collaborative-coding
  getSupportedLanguages
};
