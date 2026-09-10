import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import RoomHeader from '../components/interview/RoomHeader';
import QuestionPane from '../components/interview/QuestionPane';
import EditorPane from '../components/interview/EditorPane';
import MonitorPanel from '../components/interview/MonitorPanel';

export default function InterviewRoomPage() {
  const { roomCode } = useParams();
  const { user, isInterviewer } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  // Socket.IO Room Joining (Preserved existing logic)
  useEffect(() => {
    if (!socket || !roomCode) return;

    const payload = {
      roomId: roomCode.toUpperCase(),
      userName: user?.fullName || (isInterviewer ? 'Interviewer' : 'Candidate'),
    };

    socket.emit('join-room', payload);
    socket.emit('room:join', payload);
    console.log(`[Socket.IO] Emitted join-room & room:join:`, payload);

    return () => {
      socket.emit('room:leave', {
        roomId: roomCode.toUpperCase(),
        userName: user?.fullName,
      });
    };
  }, [socket, roomCode, user, isInterviewer]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-arena-bg text-slate-100 font-sans">
      {/* Top Navigation & Status Bar */}
      <RoomHeader
        roomCode={roomCode ? roomCode.toUpperCase() : 'INT-DEMO'}
        title="Senior Technical Coding Assessment"
        durationMinutes={60}
        participants={user ? [user] : []}
        isInterviewer={isInterviewer}
        editingState="granted"
        editorName={user?.fullName || 'You'}
        onLeave={() => navigate('/dashboard')}
      />

      {/* 3-Column Collaborative Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Problem & Specifications (3 cols / 25%) */}
        <div className="hidden lg:block lg:col-span-3 h-full overflow-hidden border-r border-arena-border">
          <QuestionPane />
        </div>

        {/* Center: Live Collaborative Code Workspace (6 cols / 50%) */}
        <div className="col-span-1 lg:col-span-6 h-full overflow-hidden">
          <EditorPane roomCode={roomCode} />
        </div>

        {/* Right: AI Feedback, Dual-Cam & Chat (3 cols / 25%) */}
        <div className="hidden lg:block lg:col-span-3 h-full overflow-hidden border-l border-arena-border">
          <MonitorPanel roomCode={roomCode} />
        </div>
      </div>
    </div>
  );
}
