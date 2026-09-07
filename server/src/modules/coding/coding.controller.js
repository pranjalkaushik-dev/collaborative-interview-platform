/**
 * Coding Controller - Judge0 Code Execution
 * Lead: Nitesh (Code Editor & Execution Lead)
 */
const { sendSuccess, sendError } = require('../../shared/utils/response.utils');

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || null;

/**
 * Execute code using Judge0 compiler API
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

    const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: Number(languageId),
        stdin: stdin || ''
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return sendError(res, response.status, `Judge0 execution failed: ${errText}`);
    }

    const result = await response.json();

    return sendSuccess(res, 200, 'Code executed successfully', {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      status: result.status || {},
      time: result.time || '0.0',
      memory: result.memory || 0,
      exitCode: result.exit_code,
      exitSignal: result.exit_signal
    });
  } catch (error) {
    console.error('[Judge0 Execution Error]:', error.message);
    return sendError(res, 500, `Execution server error: ${error.message}`);
  }
};

/**
 * Supported Language Mapping
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

  return sendSuccess(res, 200, 'Supported languages retrieved', { languages });
};

module.exports = {
  runCode,
  getSupportedLanguages
};
