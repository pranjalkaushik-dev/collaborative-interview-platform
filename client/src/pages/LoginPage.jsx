import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  Lock,
  Mail,
  User,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    accountRole: 'CANDIDATE',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(
          formData.fullName,
          formData.email,
          formData.password,
          formData.accountRole
        );
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'INTERVIEWER') {
      setFormData({
        fullName: 'Lead Interviewer',
        email: 'interviewer@devarena.ai',
        password: 'Password123',
        accountRole: 'INTERVIEWER',
      });
    } else {
      setFormData({
        fullName: 'Demo Candidate',
        email: 'candidate@devarena.ai',
        password: 'Password123',
        accountRole: 'CANDIDATE',
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-arena-bg text-arena-text">
      {/* Left Column: Product Value Showcase & Telemetry */}
      <div className="hidden lg:flex lg:w-1/2 bg-arena-surface border-r border-arena-border p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-subtle-rim">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-lg text-white">DevArena</span>
            <Badge variant="blue" size="xs">
              Enterprise Ready
            </Badge>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-white font-display leading-snug">
            Collaborative coding and AI-assisted technical interviews.
          </h2>
          <p className="mt-4 text-sm text-arena-muted leading-relaxed max-w-md">
            Execute real-time candidate code with sandboxed Judge0, evaluate algorithmic complexity with Google Gemini, and prevent integrity violations with dual-camera monitoring.
          </p>

          {/* Interactive terminal aesthetic widget */}
          <div className="mt-8 rounded-lg border border-arena-borderLight bg-arena-panel/80 p-4 font-mono text-xs shadow-editor max-w-md">
            <div className="flex items-center justify-between pb-2 border-b border-arena-border mb-3 text-arena-dim text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                devarena-runtime ~ session-init
              </span>
              <span className="text-emerald-400 text-[10px] font-semibold">ONLINE</span>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <p className="text-blue-400">&gt; verifying JWT auth token...</p>
              <p className="text-emerald-400">&gt; role permission: verified</p>
              <p className="text-slate-400">&gt; socket gateway: wss://devarena.io/socket.io</p>
              <p className="text-purple-400">&gt; AI model: gemini-pro-complexity ready</p>
            </div>
          </div>
        </div>

        <div className="border-t border-arena-border pt-6 text-xs text-arena-dim flex items-center justify-between">
          <span>DevArena Security & Proctoring Suite</span>

        </div>
      </div>

      {/* Right Column: Authentication Card Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white font-display">
                {mode === 'login' ? 'Sign in to DevArena' : 'Create an Account'}
              </h1>
              <Link to="/" className="text-xs text-blue-400 hover:underline">
                Back to home
              </Link>
            </div>
            <p className="text-xs text-arena-muted">
              {mode === 'login'
                ? 'Enter your credentials to access your interview workspace'
                : 'Select your role and start conducting or taking technical interviews'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-arena-panel rounded-lg border border-arena-border">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-arena-blue text-white shadow-sm'
                  : 'text-arena-muted hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-arena-blue text-white shadow-sm'
                  : 'text-arena-muted hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-md text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Role selection radio cards */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, accountRole: 'CANDIDATE' }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.accountRole === 'CANDIDATE'
                          ? 'bg-arena-card border-blue-500/80 shadow-card-glow'
                          : 'bg-arena-surface border-arena-border hover:border-arena-borderLight'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">Candidate</div>
                      <div className="text-[10px] text-arena-muted mt-0.5">
                        Join sessions & take assessments
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, accountRole: 'INTERVIEWER' }))
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.accountRole === 'INTERVIEWER'
                          ? 'bg-arena-card border-blue-500/80 shadow-card-glow'
                          : 'bg-arena-surface border-arena-border hover:border-arena-borderLight'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">Interviewer</div>
                      <div className="text-[10px] text-arena-muted mt-0.5">
                        Create rooms & evaluate code
                      </div>
                    </button>
                  </div>
                </div>

                <Input
                  label="Full Name"
                  name="fullName"
                  icon={User}
                  placeholder="e.g. Alex Johnson"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              {mode === 'login' ? 'Sign In' : 'Create My Account'}
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="p-3.5 rounded-lg bg-arena-surface border border-arena-border space-y-2">
            <div className="flex items-center justify-between text-[11px] text-arena-dim">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Evaluation Demo Presets
              </span>
              <span>1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('INTERVIEWER')}
                className="px-2.5 py-2 rounded bg-arena-panel hover:bg-arena-card border border-arena-border text-left transition-colors"
              >
                <div className="text-xs font-semibold text-blue-400">Interviewer</div>
                <div className="text-[10px] text-arena-dim truncate">
                  interviewer@devarena.ai
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('CANDIDATE')}
                className="px-2.5 py-2 rounded bg-arena-panel hover:bg-arena-card border border-arena-border text-left transition-colors"
              >
                <div className="text-xs font-semibold text-emerald-400">Candidate</div>
                <div className="text-[10px] text-arena-dim truncate">
                  candidate@devarena.ai
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
