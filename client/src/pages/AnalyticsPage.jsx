import React from 'react';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Code2,
  Cpu,
} from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'Pass / Hire Recommendation',
      value: '74.2%',
      change: '+4.8% vs last month',
      isPositive: true,
    },
    {
      title: 'Avg Time to Optimal Solution',
      value: '28m 14s',
      change: '-2m 30s improvement',
      isPositive: true,
    },
    {
      title: 'Algorithmic Quality Avg',
      value: '88.5/100',
      change: '+3.1 points',
      isPositive: true,
    },
    {
      title: 'Proctoring Integrity Rate',
      value: '99.1%',
      change: '0 critical breaches',
      isPositive: true,
    },
  ];

  const candidateOutcomes = [
    {
      candidate: 'Aarav Sharma',
      role: 'Backend Engineer',
      problem: 'LRU Cache Design',
      score: '94/100',
      complexity: 'O(1) Time • O(C) Space',
      integrity: 'Verified (0 alerts)',
      verdict: 'Strong Hire',
    },
    {
      candidate: 'Pooja Nair',
      role: 'Fullstack Developer',
      problem: 'Two Sum with HashMap',
      score: '88/100',
      complexity: 'O(N) Time • O(N) Space',
      integrity: 'Verified (1 tab-switch)',
      verdict: 'Hire',
    },
    {
      candidate: 'Karthik Verma',
      role: 'Frontend Specialist',
      problem: 'Valid Parentheses Parser',
      score: '82/100',
      complexity: 'O(N) Time • O(N) Space',
      integrity: 'Verified (0 alerts)',
      verdict: 'Hire',
    },
    {
      candidate: 'Rohan Gupta',
      role: 'System Architect',
      problem: 'Distributed Rate Limiter',
      score: '67/100',
      complexity: 'O(N^2) Suboptimal',
      integrity: 'Flagged (3 tab-switches)',
      verdict: 'Review Required',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-arena-border">
        <h1 className="text-xl font-bold text-white font-display">
          Interview Intelligence & Performance Analytics
        </h1>
        <p className="text-xs text-arena-muted mt-0.5">
          Real-time metrics on candidate algorithmic competence, time efficiency, and proctoring integrity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-4 bg-arena-surface">
            <div className="text-xs text-arena-dim">{m.title}</div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {m.value}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{m.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complexity Distribution Breakdown */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Time Complexity Distribution</span>
            </div>
            <Badge variant="purple" size="xs">Gemini Analyzed</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-arena-muted mb-1">
                <span>Optimal O(1) / O(log N)</span>
                <span className="text-emerald-400 font-mono font-semibold">42%</span>
              </div>
              <div className="h-2 bg-arena-panel rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-arena-muted mb-1">
                <span>Linear O(N)</span>
                <span className="text-blue-400 font-mono font-semibold">45%</span>
              </div>
              <div className="h-2 bg-arena-panel rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-arena-muted mb-1">
                <span>Sub-optimal O(N log N) or O(N²)</span>
                <span className="text-amber-400 font-mono font-semibold">13%</span>
              </div>
              <div className="h-2 bg-arena-panel rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '13%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Proctoring Integrity Summary */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assessment Proctoring Integrity</span>
            </div>
            <Badge variant="emerald" size="xs">Dual-Cam & Focus</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-arena-panel rounded-lg border border-arena-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Zero-Violation Sessions</div>
                <div className="text-[11px] text-arena-dim">Unbroken focus & fullscreen adherence</div>
              </div>
              <div className="text-base font-mono font-bold text-emerald-400">92.4%</div>
            </div>

            <div className="p-3 bg-arena-panel rounded-lg border border-arena-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Secondary Mobile Cam Paired</div>
                <div className="text-[11px] text-arena-dim">Desk and keyboard angle verified</div>
              </div>
              <div className="text-base font-mono font-bold text-blue-400">81.0%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Candidate Performance Log Table */}
      <Card>
        <CardHeader>
          <div className="font-semibold text-sm text-white">Recent Candidate Evaluations</div>
          <div className="text-xs text-arena-muted">Detailed outcomes from live assessment sessions</div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-arena-panel/60 border-b border-arena-border text-arena-dim uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Complexity</th>
                <th className="py-3 px-4">Integrity Status</th>
                <th className="py-3 px-4 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border font-sans">
              {candidateOutcomes.map((item, idx) => (
                <tr key={idx} className="hover:bg-arena-panel/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">{item.candidate}</td>
                  <td className="py-3 px-4 text-arena-muted">{item.role}</td>
                  <td className="py-3 px-4 text-slate-300">{item.problem}</td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">{item.score}</td>
                  <td className="py-3 px-4 font-mono text-arena-dim text-[11px]">{item.complexity}</td>
                  <td className="py-3 px-4 text-arena-dim">{item.integrity}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge
                      variant={
                        item.verdict === 'Strong Hire'
                          ? 'emerald'
                          : item.verdict === 'Hire'
                          ? 'blue'
                          : 'amber'
                      }
                      size="xs"
                    >
                      {item.verdict}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
