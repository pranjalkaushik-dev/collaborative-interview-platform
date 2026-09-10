import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import interviewApi from '../api/interviewApi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import StatusDot from '../components/ui/StatusDot';
import {
  Code2,
  Terminal,
  ArrowRight,
  Video,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function CandidateDashboard() {
  const [roomCode, setRoomCode] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchJoinedInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getInterviews();
      setInterviews(res.data?.interviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedInterviews();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return;

    setJoining(true);
    setError('');

    try {
      const res = await interviewApi.joinInterview(cleanCode);
      const interview = res.data?.interview;
      navigate(`/room/${interview.roomCode}`);
    } catch (err) {
      setError(err.message || 'Unable to join room. Verify code with your interviewer.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* "What Should I Do Next?" Hero Action Banner */}
      <div className="rounded-xl border border-arena-borderLight bg-gradient-to-r from-arena-surface via-arena-panel to-arena-surface p-6 shadow-subtle-rim relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Terminal className="w-3 h-3" />
              <span>Candidate Command Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Welcome back, {user?.fullName || 'Candidate'}
            </h1>
            <p className="text-xs text-arena-muted leading-relaxed">
              Have a live interview round scheduled? Enter your 6-character room code below to launch your sandboxed IDE and start coding.
            </p>
          </div>

          {/* Quick Room Code Entry Widget */}
          <div className="bg-arena-surface border border-arena-border rounded-lg p-3.5 w-full md:w-80 shadow-md space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Join Active Session</span>
              <span className="text-[10px] text-arena-dim font-mono">Format: INT-XXXX</span>
            </div>

            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                placeholder="INT-8A9F"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-arena-panel border border-arena-border rounded-md text-white tracking-wider focus:outline-none focus:border-arena-blue font-bold"
              />
              <Button
                type="submit"
                size="sm"
                isLoading={joining}
                disabled={joining || !roomCode.trim()}
                icon={ArrowRight}
              >
                Join
              </Button>
            </form>

            {error && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Performance & Readiness Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Interviews Taken</span>
            <Video className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-2">
            {interviews.length}
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Completed or joined rounds</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Code Quality Avg</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-2">
            89<span className="text-xs font-normal text-arena-dim">/100</span>
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Based on Gemini evaluation</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Integrity Score</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">
            100%
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Zero proctoring violations</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>P2P Practice Mode</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-2">
            Ready
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Collaborate with peers</div>
        </Card>
      </div>

      {/* Main Content Grid: Upcoming / Previous Sessions & Quick Launchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Session History & Invitations */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              actions={
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={fetchJoinedInterviews}
                  disabled={loading}
                >
                  Refresh
                </Button>
              }
            >
              <div className="font-semibold text-sm text-white">Your Interview Sessions</div>
              <div className="text-xs text-arena-muted">
                Invited sessions, live assessment codes, and history
              </div>
            </CardHeader>

            {loading ? (
              <div className="p-8 text-center text-xs text-arena-dim">
                Loading session records...
              </div>
            ) : interviews.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-arena-panel border border-arena-border text-arena-dim flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  No interview sessions recorded yet
                </div>
                <p className="text-[11px] text-arena-dim max-w-xs mx-auto">
                  When an interviewer schedules a round or gives you a code, enter it above to join.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-arena-border">
                {interviews.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-arena-panel/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-arena-panel px-2 py-0.5 rounded border border-arena-border">
                          {item.roomCode}
                        </span>
                        <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                        <Badge
                          variant={item.status === 'LIVE' ? 'live' : 'neutral'}
                          size="xs"
                          dot={item.status === 'LIVE'}
                        >
                          {item.status || 'SCHEDULED'}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-arena-muted flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-arena-dim" />
                          {item.durationMinutes} mins
                        </span>
                        <span>&bull;</span>
                        <span>Track: {item.interviewType || 'Coding'}</span>
                      </div>
                    </div>

                    <Button
                      size="xs"
                      variant={item.status === 'LIVE' ? 'primary' : 'secondary'}
                      onClick={() => navigate(`/room/${item.roomCode}`)}
                      icon={ArrowRight}
                    >
                      {item.status === 'LIVE' ? 'Enter Room' : 'Revisit Room'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Quick Launchers & Preparation */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="font-semibold text-xs text-white">Interview Readiness</div>
              <div className="text-[11px] text-arena-muted">Recommended practice before live rounds</div>
            </CardHeader>

            <CardBody className="space-y-3">
              <Link
                to="/practice"
                className="block p-3 rounded-lg bg-arena-panel border border-arena-border hover:border-blue-500/50 hover:bg-arena-card transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-blue-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    P2P Mock Interview
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-arena-dim group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-arena-muted leading-tight">
                  Pair up with a colleague or friend to practice live coding questions under realistic timed conditions.
                </p>
              </Link>

              <Link
                to="/rooms"
                className="block p-3 rounded-lg bg-arena-panel border border-arena-border hover:border-blue-500/50 hover:bg-arena-card transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-blue-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    Shared Coding Rooms
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-arena-dim group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-arena-muted leading-tight">
                  Collaborate in real-time scratchpads with shared execution and instant compiler diagnostics.
                </p>
              </Link>
            </CardBody>
          </Card>

          {/* Device Pre-Check Advice */}
          <div className="p-4 rounded-lg bg-arena-panel border border-arena-border space-y-2 text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proctoring Checklist</span>
            </div>
            <p className="text-[11px] text-arena-dim leading-relaxed">
              When entering your live session, grant camera & microphone permissions and keep your smartphone handy if the interviewer requires secondary desk QR pairing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
