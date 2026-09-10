<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import InterviewerDashboard from './pages/InterviewerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateJoinPage from './pages/CandidateJoinPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import QuestionBankPage from './pages/QuestionBankPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import MockInterviewsPage from './pages/MockInterviewsPage';
import CodingRoomsPage from './pages/CodingRoomsPage';

// Layout
import AppShell from './components/layout/AppShell';

// ProtectedRoute: Redirects to /login if not authenticated
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-arena-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-arena-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-arena-muted font-mono">Loading DevArena...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.accountRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// DashboardRoute: Renders role-based dashboard inside AppShell
function DashboardRoute() {
  const { isInterviewer } = useAuth();
  return (
    <AppShell>
      {isInterviewer ? <InterviewerDashboard /> : <CandidateDashboard />}
    </AppShell>
  );
}

// AuthRedirect: Redirects authenticated users away from login/landing
function AuthRedirect({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-arena-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-arena-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AuthRedirect>
            <LandingPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />

      {/* Protected: Dashboard (role-adaptive) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        }
      />

      {/* Protected: Interviews list (alias for dashboard) */}
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        }
      />

      {/* Protected: Join Room */}
      <Route
        path="/join"
        element={
          <ProtectedRoute>
            <AppShell>
              <CandidateJoinPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected: Collaborative Interview Room (full-screen, no sidebar) */}
      <Route
        path="/room/:roomCode"
        element={
          <ProtectedRoute>
            <InterviewRoomPage />
          </ProtectedRoute>
        }
      />

      {/* Protected: Question Bank (Interviewer only) */}
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <AppShell>
              <QuestionBankPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected: Analytics (Interviewer only) */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppShell>
              <AnalyticsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected: Practice & Mock Interviews */}
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <AppShell>
              <MockInterviewsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected: Coding Rooms */}
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <AppShell>
              <CodingRoomsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Protected: Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <SettingsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Fallback: Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
=======
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemPane } from './components/ProblemPane';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { SUPPORTED_LANGUAGES, SAMPLE_PROBLEMS } from './constants/languages';
import { initSocket, getSocket, joinRoom, emitCodeChange, disconnectSocket } from './services/socket';
import { executeCode } from './services/judge0';
import './App.css';

function App() {
  // Parse URL parameters for room, user, role
  const queryParams = new URLSearchParams(window.location.search);
  const initialRoom = queryParams.get('room') || 'INT-DEMO';
  const initialUser = queryParams.get('user') || 'Nitesh (Lead)';
  const initialRole = queryParams.get('role') || 'INTERVIEWER';

  const [roomId, setRoomId] = useState(initialRoom);
  const [currentUser, setCurrentUser] = useState({ name: initialUser, role: initialRole });
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]); // Python default
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].starterCode);
  const [theme, setTheme] = useState('vs-dark');
  
  const [stdin, setStdin] = useState('');
  const [executionResult, setExecutionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [remoteTypingUser, setRemoteTypingUser] = useState(null);

  // References to avoid infinite emit loops
  const isRemoteChangeRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const remoteTypingTimeoutRef = useRef(null);

  // Setup Socket.IO connection
  useEffect(() => {
    const socket = initSocket({
      serverUrl: 'http://localhost:5000',
      userName: currentUser.name,
      role: currentUser.role
    });

    const handleConnect = () => {
      setIsConnected(true);
      console.log(`[Socket.IO] Connected to http://localhost:5000. Joining room: ${roomId}`);
      joinRoom(roomId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleRoomState = ({ code: serverCode, participants: serverParticipants }) => {
      console.log('[Socket.IO] Received initial room state');
      if (serverCode !== null && serverCode !== undefined && serverCode.trim() !== '') {
        isRemoteChangeRef.current = true;
        setCode(serverCode);
      }
      if (serverParticipants) {
        setParticipants(serverParticipants);
      }
    };

    const handleUserJoined = (data) => {
      console.log('[Socket.IO] User joined:', data.userName);
      if (data.participants) {
        setParticipants(data.participants);
      }
    };

    const handleUserLeft = (data) => {
      console.log('[Socket.IO] User left:', data.userName);
      if (data.participants) {
        setParticipants(data.participants);
      }
    };

    const handleCodeUpdate = ({ code: newCode }) => {
      // Mark as remote update so our onChange handler does NOT re-emit back to server
      isRemoteChangeRef.current = true;
      setCode(newCode);

      // Flash typing indicator
      setRemoteTypingUser('Collaborator');
      if (remoteTypingTimeoutRef.current) clearTimeout(remoteTypingTimeoutRef.current);
      remoteTypingTimeoutRef.current = setTimeout(() => {
        setRemoteTypingUser(null);
      }, 1200);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('room-state', handleRoomState);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('code-update', handleCodeUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('room-state', handleRoomState);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('code-update', handleCodeUpdate);
    };
  }, [roomId, currentUser]);

  // Handle Room Change
  const handleRoomChange = (newRoomId) => {
    setRoomId(newRoomId);
    // Update URL without reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', newUrl);
    joinRoom(newRoomId);
  };

  // Handle Code Change in Monaco Editor
  const handleCodeChange = (newCode) => {
    // If update came from remote peer, ignore re-emitting
    if (isRemoteChangeRef.current) {
      isRemoteChangeRef.current = false;
      return;
    }

    setCode(newCode);

    // Debounce broadcasting code to prevent socket flooding
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      emitCodeChange(roomId, newCode);
    }, 60);
  };

  // Handle Language Change
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    // Ask or check if code should be replaced with starter code
    const isDefault = SUPPORTED_LANGUAGES.some(l => l.starterCode === code);
    if (isDefault || code.trim() === '') {
      setCode(newLang.starterCode);
      emitCodeChange(roomId, newLang.starterCode);
    }
  };

  // Reset Code
  const handleResetCode = () => {
    if (window.confirm('Reset editor to default template? Live collaborators will also be updated.')) {
      setCode(selectedLanguage.starterCode);
      emitCodeChange(roomId, selectedLanguage.starterCode);
    }
  };

  // Run Code with Judge0
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode({
        languageId: selectedLanguage.id,
        sourceCode: code,
        stdin
      });
      setExecutionResult(result);
    } catch (err) {
      setExecutionResult({
        stdout: '',
        stderr: err.message,
        compileOutput: '',
        status: { id: -1, description: 'Client Execution Error' },
        time: '0.00',
        memory: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter to Run Code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedLanguage, stdin]);

  return (
    <div className={`platform-layout ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      {/* Top Navbar */}
      <Navbar
        roomId={roomId}
        onRoomChange={handleRoomChange}
        isConnected={isConnected}
        participants={participants}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* Main Workspace Body */}
      <main className="workspace-main">
        {/* Left: Problem Statement Panel */}
        <ProblemPane
          problem={currentProblem}
          isCollapsed={isProblemCollapsed}
          onToggleCollapse={() => setIsProblemCollapsed(!isProblemCollapsed)}
        />

        {/* Center & Right: Code Editor + Output Console */}
        <div className="editor-console-split">
          <div className="editor-section">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              theme={theme}
              onThemeChange={setTheme}
              onRunCode={handleRunCode}
              isRunning={isRunning}
              onResetCode={handleResetCode}
              remoteTypingUser={remoteTypingUser}
            />
          </div>

          <div className="console-section">
            <OutputConsole
              executionResult={executionResult}
              isRunning={isRunning}
              stdin={stdin}
              onStdinChange={setStdin}
              onClearOutput={() => setExecutionResult(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
>>>>>>> origin/feature/collaborative-coding
