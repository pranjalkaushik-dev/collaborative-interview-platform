import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewApi from '../api/interviewApi';
import CreateInterviewModal from '../components/interview/CreateInterviewModal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import StatusDot from '../components/ui/StatusDot';
import {
  Video,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  ShieldCheck,
  Code2,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function InterviewerDashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await interviewApi.getInterviews();
      setInterviews(res.data?.interviews || []);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleCreateSubmit = async (payload) => {
    setCreating(true);
    try {
      const res = await interviewApi.createInterview(payload);
      const newInterview = res.data?.interview;
      setCreatedRoom(newInterview);
      fetchInterviews();
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Filter logic
  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roomCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = interviews.filter((i) => i.status === 'LIVE').length;
  const scheduledCount = interviews.filter((i) => i.status === 'SCHEDULED').length;
  const completedCount = interviews.filter((i) => i.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-arena-border">
        <div>
          <h1 className="text-xl font-bold text-white font-display">
            Interviewer Management Console
          </h1>
          <p className="text-xs text-arena-muted mt-0.5">
            Monitor ongoing sessions, schedule technical coding rounds, and review AI candidate evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInterviews}
            isLoading={loading}
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCreatedRoom(null);
              setIsCreateModalOpen(true);
            }}
            icon={Plus}
          >
            Create Interview
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-xs text-rose-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Total Interviews</span>
            <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-2">
            {interviews.length}
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Sessions on record</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Live / Active Now</span>
            <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <StatusDot status="live" pulse />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">
            {activeCount}
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Real-time candidate rooms</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Scheduled</span>
            <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-2">
            {scheduledCount}
          </div>
          <div className="text-[11px] text-arena-dim mt-1">Pending candidate entry</div>
        </Card>

        <Card className="p-4 bg-arena-surface">
          <div className="flex items-center justify-between text-xs text-arena-dim">
            <span>Avg AI Evaluation</span>
            <div className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-2">
            87<span className="text-xs font-normal text-arena-dim">/100</span>
          </div>
          <div className="text-[11px] text-arena-dim mt-1">High algorithmic quality</div>
        </Card>
      </div>

      {/* Main Filterable Table Panel */}
      <Card>
        <CardHeader
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-arena-dim" />
                <input
                  type="text"
                  placeholder="Search by title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs bg-arena-panel border border-arena-border rounded-md text-white placeholder-arena-dim w-48 sm:w-64 focus:outline-none focus:border-arena-blue"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-arena-panel border border-arena-border rounded-md text-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="LIVE">Live</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          }
        >
          <div className="font-semibold text-sm text-white">Interview Sessions</div>
          <div className="text-xs text-arena-muted">
            All active, pending, and completed candidate rounds
          </div>
        </CardHeader>

        {loading ? (
          <div className="py-16 text-center text-xs text-arena-dim">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
            <span>Fetching interview sessions...</span>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-arena-panel border border-arena-border text-arena-dim flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">No interview rooms found</h3>
              <p className="text-xs text-arena-dim max-w-sm mx-auto">
                {searchQuery
                  ? 'No sessions match your search criteria. Try a different query.'
                  : 'Get started by scheduling your first technical coding round.'}
              </p>
            </div>
            {!searchQuery && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                icon={Plus}
              >
                Create First Interview
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-arena-panel/60 border-b border-arena-border text-arena-dim uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Room Code</th>
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border font-sans">
                {filteredInterviews.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-arena-panel/40 transition-colors group"
                  >
                    {/* Room Code */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-arena-panel px-2 py-0.5 rounded border border-arena-border">
                          {item.roomCode}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.roomCode)}
                          className="text-arena-dim hover:text-white p-1 rounded hover:bg-arena-card transition-colors"
                          title="Copy Room Code"
                        >
                          {copiedCode === item.roomCode ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Title & Desc */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-arena-dim truncate max-w-xs">
                        {item.description || 'No description provided'}
                      </div>
                    </td>

                    {/* Track */}
                    <td className="py-3 px-4">
                      <Badge variant="blue" size="xs">
                        {item.interviewType || 'CODING'}
                      </Badge>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-arena-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-arena-dim" />
                        {item.durationMinutes} mins
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          item.status === 'LIVE'
                            ? 'live'
                            : item.status === 'COMPLETED'
                            ? 'emerald'
                            : 'neutral'
                        }
                        size="xs"
                        dot={item.status === 'LIVE'}
                      >
                        {item.status || 'SCHEDULED'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => navigate(`/room/${item.roomCode}`)}
                          icon={ExternalLink}
                        >
                          Enter Room
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Schedule / Create Interview Modal */}
      <CreateInterviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        creating={creating}
        createdRoom={createdRoom}
      />
    </div>
  );
}
