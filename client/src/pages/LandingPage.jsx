import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  ShieldAlert,
  Cpu,
  Video,
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  QrCode,
  Users,
  Layers,
  Lock,
  Zap,
  Smartphone,
  Check,
  AlertTriangle,
  Server,
  Database,
  Radio,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatusDot from '../components/ui/StatusDot';
import QRCodeView from '../components/ui/QRCodeView';

export default function LandingPage() {
  const { user, isInterviewer } = useAuth();
  const [activeTab, setActiveTab] = useState('js');

  const demoSnippets = {
    js: `// DevArena Collaborative Live Editor
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i]; // O(1) Lookup
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    py: `# DevArena Collaborative Live Editor
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i] # O(1) Lookup
        seen[num] = i
    return []`,
  };

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text">

      {/* Sticky Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-arena-bg/90 backdrop-blur-md border-b border-arena-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-subtle-rim">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-white tracking-tight">DevArena</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-1.5 text-xs text-arena-muted hover:text-white hover:bg-arena-surface rounded transition-colors">Features</a>
            <a href="#proctoring" className="px-3 py-1.5 text-xs text-arena-muted hover:text-white hover:bg-arena-surface rounded transition-colors">Dual-Camera Proctoring</a>
            <a href="#ai-eval" className="px-3 py-1.5 text-xs text-arena-muted hover:text-white hover:bg-arena-surface rounded transition-colors">AI Complexity Engine</a>
            <a href="#architecture" className="px-3 py-1.5 text-xs text-arena-muted hover:text-white hover:bg-arena-surface rounded transition-colors">Architecture</a>
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" icon={ArrowRight}>Open Workspace</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="outline">Sign In</Button>
                </Link>
                <Link to="/login?tab=register" className="hidden sm:block">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="text-center relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arena-surface border border-arena-border text-xs text-blue-400 mb-6 shadow-subtle-rim">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">DevArena Engine 2.0</span>
            <span className="text-arena-border">•</span>
            <span className="text-arena-muted">AI-Assisted Technical Assessment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
            The Modern Platform for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Technical Interviews
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-arena-muted max-w-2xl mx-auto leading-relaxed">
            Collaborative real-time code editor, automated Judge0 test validation, integrated Gemini AI complexity evaluation, and dual-camera tamper monitoring built for engineering teams.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" icon={ArrowRight}>
                  Open {isInterviewer ? 'Interviewer' : 'Candidate'} Workspace
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login?tab=register">
                  <Button size="lg" icon={ArrowRight}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/join">
                  <Button size="lg" variant="secondary" icon={Code2}>
                    Join with Room Code
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Value props ticks */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-arena-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Tokenized Collaborative Editing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Real-time Big-O Complexity
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Dual-Camera QR Proctoring
            </span>
          </div>
        </div>

        {/* Realistic IDE Product Preview Mockup */}
        <div className="mt-14 relative z-10 max-w-5xl mx-auto">
          <div className="rounded-xl border border-arena-borderLight bg-arena-surface shadow-editor overflow-hidden">
            {/* Mockup Title bar */}
            <div className="h-10 bg-arena-panel border-b border-arena-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-arena-dim ml-3">
                  DevArena Live Session · INT-8A9F · 00:44:19
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="live" size="xs" dot>
                  LIVE CODING
                </Badge>
              </div>
            </div>

            {/* Split layout inside mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-arena-border text-xs">
              {/* Problem Spec (4 cols) */}
              <div className="md:col-span-4 p-4 bg-arena-surface/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Problem 1: Two Sum</span>
                  <Badge variant="amber" size="xs">
                    Medium
                  </Badge>
                </div>
                <p className="text-arena-muted text-[11px] leading-relaxed">
                  Given an array of integers <code className="bg-arena-panel px-1 py-0.5 rounded text-white">nums</code> and an integer <code className="bg-arena-panel px-1 py-0.5 rounded text-white">target</code>, return indices of the two numbers such that they add up to target.
                </p>
                <div className="p-2.5 rounded bg-arena-panel border border-arena-border text-[11px] font-mono text-arena-muted">
                  <div className="text-slate-300 font-semibold">Test Case 1:</div>
                  <div>Input: nums = [2,7,11,15], target = 9</div>
                  <div className="text-emerald-400">Output: [0, 1] (Passed)</div>
                </div>
                <div className="pt-2 border-t border-arena-border flex items-center justify-between text-[11px] text-arena-dim">
                  <span>Proctoring: Active</span>
                  <span className="text-emerald-400 font-medium">0 Violations</span>
                </div>
              </div>

              {/* Code Editor (5 cols) */}
              <div className="md:col-span-5 bg-arena-bg flex flex-col font-mono text-xs">
                <div className="h-8 bg-arena-panel/60 border-b border-arena-border px-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('js')}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        activeTab === 'js' ? 'bg-arena-card text-blue-400 font-medium' : 'text-arena-dim'
                      }`}
                    >
                      solution.js
                    </button>
                    <button
                      onClick={() => setActiveTab('py')}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        activeTab === 'py' ? 'bg-arena-card text-blue-400 font-medium' : 'text-arena-dim'
                      }`}
                    >
                      solution.py
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Token: You are editing
                  </span>
                </div>

                <div className="p-3 leading-relaxed text-slate-200 overflow-x-auto text-[11px]">
                  <pre className="font-mono">{demoSnippets[activeTab]}</pre>
                </div>

                <div className="mt-auto border-t border-arena-border p-2 bg-arena-surface/40 flex items-center justify-between">
                  <span className="text-[10px] text-arena-dim">Judge0 Sandbox: Online</span>
                  <div className="flex gap-2">
                    <Button size="xs" variant="success" icon={Play}>
                      Run Tests
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI & Proctoring Telemetry (3 cols) */}
              <div className="md:col-span-3 p-3 bg-arena-surface space-y-3">
                {/* AI Evaluation */}
                <div className="p-2.5 rounded-lg bg-arena-panel border border-arena-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      AI Evaluation
                    </span>
                    <Badge variant="purple" size="xs">
                      92/100
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-arena-card border border-arena-border text-center">
                      <div className="text-arena-dim">Time</div>
                      <div className="text-emerald-400 font-bold">O(N)</div>
                    </div>
                    <div className="p-1.5 rounded bg-arena-card border border-arena-border text-center">
                      <div className="text-arena-dim">Space</div>
                      <div className="text-blue-400 font-bold">O(N)</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-arena-muted leading-tight">
                    Linear pass with hash set achieves optimal asymptotic time complexity.
                  </p>
                </div>

                {/* Dual-Camera Stream Preview */}
                <div className="p-2.5 rounded-lg bg-arena-panel border border-arena-border space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-blue-400" />
                      Dual-Cam Stream
                    </span>
                    <StatusDot status="live" label="Live" pulse />
                  </div>
                  <div className="relative h-16 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-arena-dim overflow-hidden">
                    <span>Primary WebRTC Face Cam</span>
                    <div className="absolute bottom-1 right-1 w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-blue-400">
                      Desk
                    </div>
                  </div>
                  <div className="text-[9px] text-arena-dim flex items-center justify-between">
                    <span>Tab switch detection: ON</span>
                    <span className="text-emerald-400">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-arena-border scroll-mt-14">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold mb-3 border border-blue-500/20">
            FEATURES OVERVIEW
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Built Specifically for High-Stakes Technical Rounds
          </h2>
          <p className="text-xs sm:text-sm text-arena-muted mt-3 leading-relaxed">
            Everything engineering leaders and candidates need for rigorous, fair, and collaborative coding evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-arena-surface border border-arena-border hover:border-arena-borderLight transition-all shadow-subtle-rim space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Tokenized Collaborative Editing</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              Explicit editing token handoff mechanism prevents chaotic concurrent typing conflicts while maintaining real-time collaborative parity between interviewer and candidate.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-blue-400 font-mono">
              <Check className="w-3.5 h-3.5 text-blue-400" />
              Zero race conditions
            </div>
          </div>

          <div className="p-6 rounded-xl bg-arena-surface border border-arena-border hover:border-arena-borderLight transition-all shadow-subtle-rim space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Sandboxed Judge0 Execution</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              Secure remote compiler containers execute candidate solutions in isolated environments. Supports JavaScript, Python, C++, and TypeScript with millisecond telemetry.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Runtime ms & Memory tracking
            </div>
          </div>

          <div className="p-6 rounded-xl bg-arena-surface border border-arena-border hover:border-arena-borderLight transition-all shadow-subtle-rim space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Automated Test Case Runner</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              Define standard, edge case, and custom tests that automatically validate candidate answers against expected outputs with detailed pass/fail assertions.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-purple-400 font-mono">
              <Check className="w-3.5 h-3.5 text-purple-400" />
              Instant assertion feedback
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-CAMERA PROCTORING SECTION */}
      <section id="proctoring" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-arena-border scroll-mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
              ANTI-CHEAT & PROCTORING
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight">
              Dual-Camera Stream & Tamper Detection Suite
            </h2>
            <p className="text-xs sm:text-sm text-arena-muted leading-relaxed">
              Verify candidate integrity without intrusive software installations. DevArena pairs the candidate's primary laptop camera with an instant secondary mobile camera angle to capture their keyboard, hands, and desk.
            </p>

            {/* Checklist of integrity features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-arena-surface border border-arena-border">
                <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">1-Click QR Smartphone Pairing</h4>
                  <p className="text-[11px] text-arena-muted mt-0.5">
                    Candidates scan an in-browser QR code with their phone to instantly stream a 360° secondary view via WebRTC.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-arena-surface border border-arena-border">
                <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Browser Tab-Switch & Focus Tracking</h4>
                  <p className="text-[11px] text-arena-muted mt-0.5">
                    Page visibility API broadcasts instant alerts to the interviewer if the candidate navigates away or switches tabs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-arena-surface border border-arena-border">
                <div className="w-7 h-7 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Enforced Fullscreen Assessment Mode</h4>
                  <p className="text-[11px] text-arena-muted mt-0.5">
                    Locks the assessment room in distraction-free fullscreen, logging any escape or window minimize attempts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Proctoring Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-arena-borderLight bg-arena-surface p-5 shadow-editor space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-arena-border">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Live Proctoring Feeds</span>
                </div>
                <Badge variant="emerald" size="xs" dot>
                  INTEGRITY VERIFIED
                </Badge>
              </div>

              {/* Dual video preview mock */}
              <div className="grid grid-cols-2 gap-3">
                {/* Primary */}
                <div className="relative h-32 rounded-lg bg-slate-950 border border-arena-border flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-white font-medium">Primary Face Cam</span>
                  <span className="text-[9px] text-arena-dim font-mono">1080p WebRTC stream</span>
                  <div className="absolute top-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-emerald-400 font-mono">
                    ✓ Face in frame
                  </div>
                </div>

                {/* Secondary Phone Angle */}
                <div className="relative h-32 rounded-lg bg-slate-950 border border-cyan-500/30 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-white font-medium">Secondary Mobile Cam</span>
                  <span className="text-[9px] text-arena-dim font-mono">Desk & Hands angle</span>
                  <div className="absolute top-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-cyan-400 font-mono">
                    ✓ QR Linked
                  </div>
                </div>
              </div>

              {/* Live Violation Log Preview */}
              <div className="p-3 rounded-lg bg-arena-panel border border-arena-border space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>Violation Event Timeline</span>
                  <span className="text-[10px] text-emerald-400">Normal (0 Breaches)</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-arena-surface border border-arena-border text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="w-3 h-3" /> Fullscreen engaged
                    </span>
                    <span className="text-arena-dim">10:00:12 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-arena-surface border border-arena-border text-slate-300">
                    <span className="flex items-center gap-1 text-blue-400">
                      <Check className="w-3 h-3" /> Secondary camera synced
                    </span>
                    <span className="text-arena-dim">10:00:45 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI EVALUATION & COMPLEXITY ENGINE SECTION */}
      <section id="ai-eval" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-arena-border scroll-mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: AI Card Preview */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-xl border border-arena-borderLight bg-arena-surface p-5 shadow-editor space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-arena-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white">Google Gemini Evaluation Engine</span>
                </div>
                <Badge variant="purple" size="xs">
                  SCORE 89/100
                </Badge>
              </div>

              {/* Big-O Complexity Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-arena-panel border border-arena-border text-center">
                  <div className="text-xs text-arena-dim mb-1">Time Complexity</div>
                  <div className="text-xl font-mono font-bold text-emerald-400">O(N)</div>
                  <div className="text-[10px] text-arena-muted mt-1">Single pass with hash table</div>
                </div>
                <div className="p-3 rounded-lg bg-arena-panel border border-arena-border text-center">
                  <div className="text-xs text-arena-dim mb-1">Space Complexity</div>
                  <div className="text-xl font-mono font-bold text-blue-400">O(N)</div>
                  <div className="text-[10px] text-arena-muted mt-1">Auxiliary Map storage</div>
                </div>
              </div>

              {/* Algorithmic strengths & issues list */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-arena-panel border border-arena-border space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Algorithmic Strengths</span>
                  </div>
                  <p className="text-[11px] text-arena-muted">
                    Optimal asymptotic lookup time avoiding naive O(N²) nested loops. Clean modular structure.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-arena-panel border border-arena-border space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Potential Optimization</span>
                  </div>
                  <p className="text-[11px] text-arena-muted">
                    If input is pre-sorted, space complexity can be reduced from O(N) to O(1) using two pointers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Description & Benefits */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono font-semibold border border-purple-500/20">
              INTELLIGENT EVALUATION
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display leading-tight">
              Real-time Big-O Complexity & Code Quality Analysis
            </h2>
            <p className="text-xs sm:text-sm text-arena-muted leading-relaxed">
              DevArena integrates AI directly into the interview feedback loop, not as a chatbot, but as an objective algorithmic assistant that computes Big-O metrics, flags edge cases, and provides interviewer talking points.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Instant asymptotic Time & Space complexity calculation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Identification of unhandled boundary conditions & duplicates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Private interviewer rubric to steer technical discussions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SYSTEM ARCHITECTURE & TECH STACK SECTION */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-arena-border scroll-mt-14">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold mb-3 border border-blue-500/20">
            SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            Decoupled, Real-time & Fault-Tolerant
          </h2>
          <p className="text-xs sm:text-sm text-arena-muted mt-3 leading-relaxed">
            Architected with a decoupled Node.js + Socket.IO server, strict MongoDB data schemas, and high-performance React client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
              UI
            </div>
            <h3 className="text-sm font-semibold text-white">Frontend Workspace</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              React 19, Tailwind CSS, Lucide icons, and Monaco-style editor with custom gutter and line highlight.
            </p>
            <div className="text-[10px] font-mono text-arena-dim pt-2 border-t border-arena-border">
              Port: 5173 &bull; Vite Build
            </div>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
              WS
            </div>
            <h3 className="text-sm font-semibold text-white">Socket.IO Gateway</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              Bi-directional event gateway handling live code sync, room join/leave, and violation alert broadcasts.
            </p>
            <div className="text-[10px] font-mono text-arena-dim pt-2 border-t border-arena-border">
              Port: 5000 &bull; WebSocket / Poll
            </div>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              DB
            </div>
            <h3 className="text-sm font-semibold text-white">Data Persistence</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              MongoDB Atlas with strict Mongoose models for User auth, Room codes (INT-XXXX), Questions, and Audit logs.
            </p>
            <div className="text-[10px] font-mono text-arena-dim pt-2 border-t border-arena-border">
              Mongoose &bull; Salted Bcrypt
            </div>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
              AI
            </div>
            <h3 className="text-sm font-semibold text-white">Judge0 & Gemini API</h3>
            <p className="text-xs text-arena-muted leading-relaxed">
              Remote sandboxed execution via Judge0 API combined with Google Gemini for automated asymptotic code review.
            </p>
            <div className="text-[10px] font-mono text-arena-dim pt-2 border-t border-arena-border">
              RESTful APIs &bull; HTTPS
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-arena-border">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold mb-3 border border-blue-500/20">
            HOW IT WORKS
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
            A Seamless 4-Step Interview Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-2">
            <span className="font-mono text-sm font-bold text-blue-400">01</span>
            <h4 className="text-sm font-semibold text-white">Create Session</h4>
            <p className="text-xs text-arena-muted leading-relaxed">
              Interviewer configures problem statement, automated test cases, and generates 6-digit room code.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-2">
            <span className="font-mono text-sm font-bold text-blue-400">02</span>
            <h4 className="text-sm font-semibold text-white">Join via Code</h4>
            <p className="text-xs text-arena-muted leading-relaxed">
              Candidate logs in, enters room code (`INT-XXXX`), and initiates camera & proctoring pre-flight.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-2">
            <span className="font-mono text-sm font-bold text-blue-400">03</span>
            <h4 className="text-sm font-semibold text-white">Live Collaborative IDE</h4>
            <p className="text-xs text-arena-muted leading-relaxed">
              Write solutions in JavaScript, Python, or C++ with live output and real-time Socket.IO synchronization.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-arena-surface border border-arena-border space-y-2">
            <span className="font-mono text-sm font-bold text-blue-400">04</span>
            <h4 className="text-sm font-semibold text-white">AI Evaluation</h4>
            <p className="text-xs text-arena-muted leading-relaxed">
              Instant algorithmic analysis, edge case scrutiny, and complete evaluation report for hiring panels.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-arena-border py-8 px-4 text-center text-xs text-arena-dim">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-white">DevArena</span>
            <span>&bull; Collaborative Coding & AI Technical Interview Platform</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
