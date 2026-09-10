import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import StatusDot from '../components/ui/StatusDot';
import {
  Code2,
  Users,
  Plus,
  ArrowRight,
  Terminal,
  MessageSquare,
  Lock,
  Globe,
} from 'lucide-react';

export default function CodingRoomsPage() {
  const [roomCode, setRoomCode] = useState('');
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const code = 'DEV-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    navigate(`/room/${code}`);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  const sampleActiveRooms = [
    {
      code: 'DEV-9X4A',
      title: 'Distributed Systems & Concurrency Patterns',
      participants: 3,
      topic: 'Go / Python Async',
      status: 'active',
    },
    {
      code: 'DEV-2T8B',
      title: 'Fullstack React Server Components Discussion',
      participants: 2,
      topic: 'TypeScript / Next.js',
      status: 'active',
    },
    {
      code: 'DEV-5M1C',
      title: 'Graph Traversal & BFS/DFS Optimizations',
      participants: 4,
      topic: 'Algorithms',
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-arena-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-display">
            Shared Coding & Discussion Rooms
          </h1>
          <p className="text-xs text-arena-muted mt-0.5">
            Real-time collaborative code scratchpads, peer pair programming, and engineering study groups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create room */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Create New Collaboration Room</span>
          </div>
          <p className="text-xs text-arena-muted leading-relaxed">
            Start a shared workspace with tokenized editing controls, real-time code broadcast, and execution console.
          </p>

          <form onSubmit={handleCreateRoom} className="space-y-3 pt-2">
            <Input
              label="Room Topic / Title"
              placeholder="e.g. Dynamic Programming Whiteboard"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              required
            />

            <Button
              type="submit"
              size="md"
              className="w-full mt-1"
              icon={Code2}
            >
              Launch Room Now
            </Button>
          </form>
        </Card>

        {/* Join room */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <span>Join Existing Room</span>
          </div>
          <p className="text-xs text-arena-muted leading-relaxed">
            Enter a room code shared by your peer or study group to join their collaborative session.
          </p>

          <form onSubmit={handleJoin} className="space-y-3 pt-2">
            <Input
              label="Room Code"
              placeholder="e.g. DEV-9X4A or INT-8A9F"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="font-mono uppercase font-bold"
              required
            />

            <Button
              type="submit"
              variant="secondary"
              size="md"
              className="w-full mt-1"
              disabled={!roomCode.trim()}
              icon={ArrowRight}
            >
              Enter Room
            </Button>
          </form>
        </Card>
      </div>

      {/* Active Study / Group Rooms */}
      <Card>
        <CardHeader>
          <div className="font-semibold text-sm text-white">Active Collaboration Rooms</div>
          <div className="text-xs text-arena-muted">Open peer rooms currently in session</div>
        </CardHeader>

        <div className="divide-y divide-arena-border">
          {sampleActiveRooms.map((room) => (
            <div
              key={room.code}
              className="p-4 flex items-center justify-between gap-4 hover:bg-arena-panel/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-arena-panel px-2 py-0.5 rounded border border-arena-border">
                    {room.code}
                  </span>
                  <span className="text-xs font-semibold text-white">{room.title}</span>
                  <StatusDot status="live" label="Live" pulse />
                </div>
                <div className="text-[11px] text-arena-dim flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-arena-dim" />
                    {room.participants} Online
                  </span>
                  <span>&bull;</span>
                  <span>{room.topic}</span>
                </div>
              </div>

              <Button
                size="xs"
                variant="outline"
                onClick={() => navigate(`/room/${room.code}`)}
                icon={ArrowRight}
              >
                Join Session
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
