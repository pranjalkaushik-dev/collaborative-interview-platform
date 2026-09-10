import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';
import Badge from '../ui/Badge';
import {
  FileText,
  Code2,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';

const PRESET_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Medium',
    desc: 'Given an array of integers nums and an integer target, return indices of two numbers that add up to target.',
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
    ],
  },
  {
    id: 'reverse-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    testCases: [
      { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' },
    ],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache Implementation',
    difficulty: 'Hard',
    desc: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    testCases: [
      { input: 'put(1,1), put(2,2), get(1)', expected: '1' },
    ],
  },
];

export default function CreateInterviewModal({
  isOpen,
  onClose,
  onSubmit,
  creating = false,
  createdRoom = null,
}) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interviewType: 'CODING',
    durationMinutes: 60,
    candidateEmail: '',
    problemPreset: 'two-sum',
    requireFullscreen: true,
    detectTabSwitch: true,
    enableDualCamera: true,
    customTestInput: 'nums = [2,7,11,15], target = 9',
    customTestOutput: '[0, 1]',
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPreset = (presetId) => {
    const selected = PRESET_PROBLEMS.find((p) => p.id === presetId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        problemPreset: presetId,
        title: prev.title || `${selected.title} Technical Round`,
        description: selected.desc,
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      interviewType: formData.interviewType,
      durationMinutes: Number(formData.durationMinutes),
    });
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={createdRoom ? 'Interview Room Created' : 'Configure Technical Interview'}
      subtitle={
        createdRoom
          ? 'Share credentials with the candidate or launch the session directly'
          : `Step ${step} of 3: ${
              step === 1
                ? 'Session & Role Specs'
                : step === 2
                ? 'Problem & Test Cases'
                : 'Proctoring & Integrity Rules'
            }`
      }
      maxWidth="max-w-xl"
    >
      {createdRoom ? (
        /* Success Screen */
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-arena-panel border border-arena-borderLight text-center space-y-2">
            <span className="text-xs text-arena-muted uppercase tracking-wider font-semibold">
              Live Session Room Code
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-3xl font-extrabold tracking-widest text-blue-400">
                {createdRoom.roomCode}
              </span>
              <button
                onClick={() => handleCopy(createdRoom.roomCode)}
                className="p-2 rounded-lg bg-arena-card hover:bg-arena-cardHover border border-arena-border text-slate-200 hover:text-white transition-colors"
                title="Copy Room Code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-arena-dim">
              The candidate can join from their dashboard using this 6-character code.
            </p>
          </div>

          <div className="p-3 bg-arena-surface rounded-lg border border-arena-border text-xs space-y-1.5 text-arena-muted">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Session Title:</span>
              <span className="text-white">{createdRoom.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Duration:</span>
              <span className="text-white">{createdRoom.durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Status:</span>
              <span className="text-emerald-400 font-semibold">{createdRoom.status}</span>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={resetAndClose}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              icon={ExternalLink}
              onClick={() => navigate(`/room/${createdRoom.roomCode}`)}
            >
              Enter Live Room Now
            </Button>
          </div>
        </div>
      ) : (
        /* Multi-step Form */
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Step Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 pb-2">
            {[
              { id: 1, label: 'Details' },
              { id: 2, label: 'Problem' },
              { id: 3, label: 'Proctoring' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`text-left p-2 rounded border text-xs transition-all ${
                  step === s.id
                    ? 'bg-arena-card border-blue-500/80 text-white font-medium'
                    : 'bg-arena-panel border-arena-border text-arena-dim hover:text-arena-muted'
                }`}
              >
                <div className="font-mono text-[10px]">0{s.id}</div>
                <div>{s.label}</div>
              </button>
            ))}
          </div>

          {/* Step 1: Session Details */}
          {step === 1 && (
            <div className="space-y-3.5">
              <Input
                label="Interview Title *"
                placeholder="e.g. Senior Frontend / Fullstack Assessment"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Assessment Track"
                  value={formData.interviewType}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, interviewType: e.target.value }))
                  }
                >
                  <option value="CODING">Live Coding & Algorithms</option>
                  <option value="TECHNICAL">Technical Architecture</option>
                  <option value="SYSTEM_DESIGN">System Design & Scaling</option>
                </Select>

                <Input
                  label="Duration (Minutes)"
                  type="number"
                  min={15}
                  max={180}
                  step={15}
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, durationMinutes: e.target.value }))
                  }
                />
              </div>

              <Input
                label="Candidate Email (Optional)"
                type="email"
                placeholder="candidate@applicant.com"
                value={formData.candidateEmail}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, candidateEmail: e.target.value }))
                }
                helperText="Candidate will also receive an invitation badge on their dashboard."
              />

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => setStep(2)}
                  disabled={!formData.title.trim()}
                >
                  Next: Problem Config
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Problem & Test Cases */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Problem Template or Custom
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PROBLEMS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        formData.problemPreset === preset.id
                          ? 'bg-arena-card border-blue-500/80 text-white'
                          : 'bg-arena-panel border-arena-border text-arena-dim hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs truncate">
                        {preset.title}
                      </div>
                      <Badge
                        variant={
                          preset.difficulty === 'Easy'
                            ? 'emerald'
                            : preset.difficulty === 'Medium'
                            ? 'amber'
                            : 'rose'
                        }
                        size="xs"
                        className="mt-1"
                      >
                        {preset.difficulty}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Problem Description & Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Paste instructions, inputs, expected constraints, or test definitions..."
                  className="w-full px-3 py-2 text-xs bg-arena-panel border border-arena-border rounded-md text-arena-text focus:outline-none focus:border-arena-blue"
                />
              </div>

              {/* Sample Test Case Config */}
              <div className="p-3 bg-arena-panel rounded-lg border border-arena-border space-y-2">
                <div className="text-[11px] font-semibold text-slate-300">
                  Sample Automated Test Case (Judge0)
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <input
                    type="text"
                    placeholder="Input: nums = [2,7,11,15], 9"
                    value={formData.customTestInput}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, customTestInput: e.target.value }))
                    }
                    className="p-1.5 bg-arena-surface border border-arena-border rounded text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Expected: [0, 1]"
                    value={formData.customTestOutput}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, customTestOutput: e.target.value }))
                    }
                    className="p-1.5 bg-arena-surface border border-arena-border rounded text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  icon={ArrowLeft}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => setStep(3)}
                >
                  Next: Proctoring Rules
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Proctoring & Integrity Rules */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div className="space-y-2.5">
                <label className="flex items-start gap-3 p-3 rounded-lg bg-arena-panel border border-arena-border cursor-pointer hover:bg-arena-card transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.detectTabSwitch}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, detectTabSwitch: e.target.checked }))
                    }
                    className="mt-0.5 rounded border-arena-border text-blue-500 focus:ring-arena-blue"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Detect Browser Tab Switching
                    </div>
                    <div className="text-[11px] text-arena-dim">
                      Instantly alerts the interviewer via Socket.IO if candidate switches focus away from the room.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-arena-panel border border-arena-border cursor-pointer hover:bg-arena-card transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.requireFullscreen}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, requireFullscreen: e.target.checked }))
                    }
                    className="mt-0.5 rounded border-arena-border text-blue-500 focus:ring-arena-blue"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Enforce Fullscreen Assessment Mode
                    </div>
                    <div className="text-[11px] text-arena-dim">
                      Requires candidate to remain in native fullscreen during the coding duration.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-arena-panel border border-arena-border cursor-pointer hover:bg-arena-card transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.enableDualCamera}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, enableDualCamera: e.target.checked }))
                    }
                    className="mt-0.5 rounded border-arena-border text-blue-500 focus:ring-arena-blue"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Enable Dual-Camera Mobile QR Pairing
                    </div>
                    <div className="text-[11px] text-arena-dim">
                      Displays a QR code for candidate to stream their desk angle alongside face webcam.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  icon={ArrowLeft}
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={creating}
                  disabled={creating || !formData.title.trim()}
                  icon={Sparkles}
                >
                  {creating ? 'Generating Session...' : 'Create & Generate Code'}
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}
