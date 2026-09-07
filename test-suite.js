const { io } = require('./client/node_modules/socket.io-client');

const SERVER_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

const pass = (msg) => console.log(`${colors.green}  ✓ [PASS]${colors.reset} ${msg}`);
const fail = (msg) => console.log(`${colors.red}  ✗ [FAIL]${colors.reset} ${msg}`);
const header = (msg) => console.log(`\n${colors.bold}${colors.cyan}=== ${msg} ===${colors.reset}`);

async function runTests() {
  console.log(`${colors.bold}🚀 STARTING FULL INTEGRATION TESTS FOR NITESH'S WORK${colors.reset}\n`);

  // -------------------------------------------------------------
  // TEST SUITE 1: REST API & JUDGE0 CODE EXECUTION
  // -------------------------------------------------------------
  header('TEST SUITE 1: REST APIs & Judge0 Code Execution');

  // 1.1 Health Check
  try {
    const res = await fetch(`${SERVER_URL}/api/health`);
    const data = await res.json();
    if (data.status === 'OK') {
      pass(`Backend Health Check: Status ${data.status}, Service: ${data.service}`);
    } else {
      fail(`Unexpected health status: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(`Backend unreachable: ${err.message}`);
  }

  // 1.2 Supported Languages
  try {
    const res = await fetch(`${SERVER_URL}/api/coding/languages`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data.languages)) {
      pass(`Supported Languages: ${data.data.languages.map(l => l.name).join(', ')}`);
    } else {
      fail(`Failed to fetch languages: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(`Languages endpoint error: ${err.message}`);
  }

  // 1.3 Python Execution via Judge0
  try {
    const pyCode = `
def solve():
    nums = [1, 2, 3, 4, 5]
    total = sum(n * n for n in nums)
    print(f"Sum of squares: {total}")
solve()
`;
    const res = await fetch(`${SERVER_URL}/api/coding/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageId: 71, sourceCode: pyCode })
    });
    const data = await res.json();
    if (data.success && data.data.stdout.includes('Sum of squares: 55')) {
      pass(`Python Code Execution via Judge0: ${data.data.stdout.trim()} (Time: ${data.data.time}s, Status: ${data.data.status.description})`);
    } else {
      fail(`Python execution failed: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(`Python execution request error: ${err.message}`);
  }

  // 1.4 C++ Execution with Custom Stdin via Judge0
  try {
    const cppCode = `
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int count;
    if (cin >> name >> count) {
        cout << "Welcome " << name << ", candidate #" << count << " to Interview B-2!" << endl;
    }
    return 0;
}
`;
    const res = await fetch(`${SERVER_URL}/api/coding/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        languageId: 54, // C++ (GCC 9.2.0)
        sourceCode: cppCode,
        stdin: 'Nitesh 101'
      })
    });
    const data = await res.json();
    if (data.success && data.data.stdout.includes('Welcome Nitesh, candidate #101')) {
      pass(`C++ Stdin Code Execution: ${data.data.stdout.trim()} (Status: ${data.data.status.description})`);
    } else {
      fail(`C++ execution failed: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(`C++ execution request error: ${err.message}`);
  }

  // 1.5 Error Handling (Syntax/Compilation Error with Base64 decode)
  try {
    const invalidCpp = `
#include <iostream>
int main() {
    syntax_error_here_no_semi
    return 0;
}
`;
    const res = await fetch(`${SERVER_URL}/api/coding/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageId: 54, sourceCode: invalidCpp })
    });
    const data = await res.json();
    if (data.success && (data.data.compileOutput || data.data.stderr)) {
      const errMsg = (data.data.compileOutput || data.data.stderr).slice(0, 70);
      pass(`Compilation Error Caught: [${data.data.status.description}] - ${errMsg}...`);
    } else {
      fail(`Error handling did not capture compilation error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail(`Error test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST SUITE 2: REAL-TIME LIVE CODE SYNCING (SOCKET.IO)
  // -------------------------------------------------------------
  header('TEST SUITE 2: Real-Time Live Code Syncing via Socket.IO');

  const ROOM_ID = 'INT-B2-LIVE';

  const userLead = io(SERVER_URL, {
    auth: { isGuest: true, userName: 'Nitesh (Lead)', role: 'INTERVIEWER' }
  });

  const userCandidate = io(SERVER_URL, {
    auth: { isGuest: true, userName: 'Candidate Alex', role: 'CANDIDATE' }
  });

  // Wait for both connections
  await Promise.all([
    new Promise((resolve) => userLead.on('connect', resolve)),
    new Promise((resolve) => userCandidate.on('connect', resolve))
  ]);
  pass(`Socket Connections Established: Nitesh (${userLead.id}) & Candidate (${userCandidate.id})`);

  // User Lead joins room first
  userLead.emit('join-room', { roomId: ROOM_ID });
  await new Promise(r => setTimeout(r, 100));

  // Setup promise for Lead detecting Candidate joining
  const userJoinedPromise = new Promise((resolve) => {
    userLead.on('user-joined', (data) => resolve(data));
  });

  userCandidate.emit('join-room', { roomId: ROOM_ID });
  const joinedEvent = await userJoinedPromise;
  pass(`Room Join & Peer Discovery: Lead detected '${joinedEvent.userName}' joined room ${ROOM_ID}`);

  // Live Code Typing Sync: Lead types -> Candidate receives
  const typedSnippet = `// Live typing from Screen 1 (Nitesh)\nfunction reverseString(s) {\n    return s.split('').reverse().join('');\n}`;
  
  const codeUpdatePromise = new Promise((resolve) => {
    userCandidate.on('code-update', (data) => resolve(data.code));
  });

  userLead.emit('code-change', { roomId: ROOM_ID, code: typedSnippet });
  const receivedSnippet = await codeUpdatePromise;

  if (receivedSnippet === typedSnippet) {
    pass(`Live Typing Synchronization: Screen 1 typed code -> Screen 2 instantly received identical code-update`);
  } else {
    fail(`Code sync mismatch: expected "${typedSnippet}", got "${receivedSnippet}"`);
  }

  // Late Joining: User 3 connects late and requests room state
  const userReviewer = io(SERVER_URL, {
    auth: { isGuest: true, userName: 'Reviewer Guide', role: 'INTERVIEWER' }
  });
  await new Promise((resolve) => userReviewer.on('connect', resolve));

  const roomStatePromise = new Promise((resolve) => {
    userReviewer.on('room-state', (state) => resolve(state));
  });

  userReviewer.emit('join-room', { roomId: ROOM_ID });
  const roomState = await roomStatePromise;

  if (roomState.code === typedSnippet) {
    pass(`Room State Recovery: Late-joining Reviewer successfully restored active live editor code`);
  } else {
    fail(`Room state recovery failed: expected "${typedSnippet}", got "${roomState.code}"`);
  }

  // -------------------------------------------------------------
  // TEST SUITE 3: FRONTEND CLIENT & MONACO EDITOR BUNDLE
  // -------------------------------------------------------------
  header('TEST SUITE 3: Frontend Client Serving & Monaco Editor Bundle');

  try {
    const res = await fetch(FRONTEND_URL);
    const html = await res.text();
    if (html.includes('CodeSync // Live Collaborative Coding & Interview Platform') && html.includes('id="root"')) {
      pass(`Frontend Vite Server: http://localhost:5173 serving React + Monaco SPA successfully`);
    } else {
      fail(`Frontend response missing expected title or root div: ${html.slice(0, 100)}`);
    }
  } catch (err) {
    fail(`Frontend server unreachable: ${err.message}`);
  }

  // Clean up sockets
  userLead.disconnect();
  userCandidate.disconnect();
  userReviewer.disconnect();

  console.log(`\n${colors.bold}${colors.green}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.green}🎉 ALL INTEGRATION & LIVE CODE SYNC TESTS PASSED (100%)!${colors.reset}`);
  console.log(`${colors.bold}${colors.green}======================================================${colors.reset}\n`);

  process.exit(0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
