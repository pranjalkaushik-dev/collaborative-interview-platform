import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  LayoutDashboard,
  Video,
  Users,
  Code2,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import StatusDot from '../ui/StatusDot';
import Badge from '../ui/Badge';

export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isInterviewer } = useAuth();
  const { isConnected } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav items tailored by role
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['INTERVIEWER', 'CANDIDATE'],
    },
    {
      name: isInterviewer ? 'Interviews' : 'My Sessions',
      path: '/interviews',
      icon: Video,
      roles: ['INTERVIEWER', 'CANDIDATE'],
    },
    {
      name: 'Practice & Mock',
      path: '/practice',
      icon: Users,
      badge: 'P2P',
      roles: ['INTERVIEWER', 'CANDIDATE'],
    },
    {
      name: 'Coding Rooms',
      path: '/rooms',
      icon: Code2,
      roles: ['INTERVIEWER', 'CANDIDATE'],
    },
    {
      name: 'Question Bank',
      path: '/questions',
      icon: BookOpen,
      roles: ['INTERVIEWER'],
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      roles: ['INTERVIEWER'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['INTERVIEWER', 'CANDIDATE'],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.accountRole || 'CANDIDATE')
  );

  return (
    <div className="min-h-screen bg-arena-bg flex overflow-x-hidden text-arena-text">
      {/* Sidebar */}
      <aside
        className={`bg-arena-surface border-r border-arena-border flex flex-col transition-all duration-200 shrink-0 select-none z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-arena-border px-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-subtle-rim shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm tracking-tight text-white">
                    DevArena
                  </span>
                  <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-arena-dim truncate">
                  Technical Interviews
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-arena-dim hover:text-white p-1 rounded hover:bg-arena-panel transition-colors hidden md:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Role Overview */}
        {!collapsed && (
          <div className="p-3 border-b border-arena-border bg-arena-panel/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {user?.fullName || 'User'}
                </span>
              </div>
              <Badge
                variant={isInterviewer ? 'blue' : 'emerald'}
                size="xs"
              >
                {user?.accountRole || 'CANDIDATE'}
              </Badge>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-arena-dim">
              <span className="truncate max-w-[150px]">{user?.email}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-arena-dim">
              Main Menu
            </div>
          )}

          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-arena-blue/15 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-arena-muted hover:text-white hover:bg-arena-panel border border-transparent'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-blue-400' : 'text-arena-dim group-hover:text-white'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-arena-panel border border-arena-border text-arena-muted font-mono">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-arena-panel border border-arena-border rounded text-[11px] text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Join CTA / Footer */}
        <div className="p-3 border-t border-arena-border space-y-2">
          {!collapsed ? (
            <Link
              to="/join"
              className="w-full flex items-center justify-between p-2 rounded bg-arena-panel/60 border border-arena-border hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium">Enter Room Code</span>
              </div>
              <ExternalLink className="w-3 h-3 text-arena-dim group-hover:text-blue-400" />
            </Link>
          ) : (
            <Link
              to="/join"
              title="Enter Room Code"
              className="w-full flex items-center justify-center p-2 rounded bg-arena-panel border border-arena-border text-blue-400 hover:text-white"
            >
              <Code2 className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs text-arena-dim hover:text-rose-400 hover:bg-rose-950/20 transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-arena-surface border-b border-arena-border px-4 flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="text-xs text-arena-dim flex items-center gap-1.5">
              <span>DevArena</span>
              <span>/</span>
              <span className="text-slate-200 font-medium capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Gateway status */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-arena-panel border border-arena-border rounded-full text-[11px]">
              <StatusDot
                status={isConnected ? 'online' : 'offline'}
                label={isConnected ? 'Gateway Connected' : 'Connecting...'}
              />
            </div>

            {/* Quick action join */}
            <Link
              to="/join"
              className="px-2.5 py-1 bg-arena-panel hover:bg-arena-card border border-arena-border rounded text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Join INT-XXXX</span>
            </Link>

            {/* User pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-arena-border">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center justify-center">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden md:inline truncate max-w-[120px]">
                {user?.fullName}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
