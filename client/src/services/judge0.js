/**
 * Judge0 Code Execution Service
 * Lead: Nitesh (Code Editor & Execution Lead)
 */

const JUDGE0_PUBLIC_API = 'https://ce.judge0.com';
const BACKEND_API = 'http://localhost:5000/api/coding/run';

/**
 * Execute source code using Judge0
 * @param {Object} params
 * @param {number} params.languageId - Judge0 Language ID
 * @param {string} params.sourceCode - Code to compile and run
 * @param {string} params.stdin - Standard input
 * @returns {Promise<Object>} Execution result
 */
export const executeCode = async ({ languageId, sourceCode, stdin = '' }) => {
  // First attempt: Backend Proxy /api/coding/run
  try {
    const backendRes = await fetch(BACKEND_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        languageId,
        sourceCode,
        stdin
      })
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success && data.data) {
        return {
          ...data.data,
          via: 'Backend Server Proxy (Port 5000)'
        };
      }
    }
  } catch (err) {
    console.warn('[Backend Execution Proxy unreachable, falling back to direct Judge0 CE]:', err.message);
  }

  // Fallback: Direct call to public Judge0 CE endpoint
  try {
    const response = await fetch(`${JUDGE0_PUBLIC_API}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin || ''
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Judge0 API error (${response.status}): ${errText}`);
    }

    const resData = await response.json();

    return {
      stdout: resData.stdout || '',
      stderr: resData.stderr || '',
      compileOutput: resData.compile_output || '',
      status: resData.status || { description: 'Completed' },
      time: resData.time || '0.0',
      memory: resData.memory || 0,
      exitCode: resData.exit_code,
      message: resData.message || '',
      via: 'Direct Judge0 CE Cloud'
    };
  } catch (error) {
    return {
      stdout: '',
      stderr: error.message || 'Unknown execution error occurred',
      compileOutput: '',
      status: { id: -1, description: 'Execution Error' },
      time: '0.00',
      memory: 0,
      via: 'Error Fallback'
    };
  }
};
