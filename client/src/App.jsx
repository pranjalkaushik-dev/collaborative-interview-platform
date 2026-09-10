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
