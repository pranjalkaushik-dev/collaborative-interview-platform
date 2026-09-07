const Submission = require('./submission.model');
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

    const headers = {
      'Content-Type': 'application/json'
    };

    if (JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    const encodedSource = Buffer.from(sourceCode, 'utf-8').toString('base64');
    const encodedStdin = stdin
      ? Buffer.from(stdin, 'utf-8').toString('base64')
      : '';

    const response = await fetch(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=true`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_code: encodedSource,
          language_id: Number(languageId),
          stdin: encodedStdin
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return sendError(
        res,
        response.status,
        'Judge0 execution error',
        errorText
      );
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
      exitCode: result.exit_code,
      exitSignal: result.exit_signal
    });
  } catch (error) {
    return sendError(res, 500, `Execution server error: ${error.message}`);
  }
};

/**
 * Submit code for final evaluation and persist it in MongoDB
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
      return sendError(
        res,
        400,
        'interviewId, sourceCode, and languageId are required'
      );
    }

    const candidateId = req.user._id;

    let score = 100;
    let status = 'PASSED';

    if (Array.isArray(testResults) && testResults.length > 0) {
      const passedCount = testResults.filter((test) => test.passed).length;

      score = Math.round(
        (passedCount / testResults.length) * 100
      );

      if (score === 100) {
        status = 'PASSED';
      } else if (score > 0) {
        status = 'PARTIAL';
      } else {
        status = 'FAILED';
      }
    }

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

    return sendSuccess(
      res,
      201,
      'Code submission saved successfully',
      {
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
      }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * Supported Judge0 language mapping
 * GET /api/coding/languages
 */
const getSupportedLanguages = (req, res) => {
  const languages = [
    { id: 71, name: 'Python (3.8.1)', monacoLang: 'python', extension: 'py' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)', monacoLang: 'javascript', extension: 'js' },
    { id: 74, name: 'TypeScript (3.7.4)', monacoLang: 'typescript', extension: 'ts' },
    { id: 54, name: 'C++ (GCC 9.2.0)', monacoLang: 'cpp', extension: 'cpp' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)', monacoLang: 'java', extension: 'java' },
    { id: 50, name: 'C (GCC 9.2.0)', monacoLang: 'c', extension: 'c' }
  ];

  return sendSuccess(
    res,
    200,
    'Supported languages retrieved',
    { languages }
  );
};

module.exports = {
  runCode,
  submitCode,
  getSupportedLanguages
};
