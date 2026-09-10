import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/common/Modal';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Code2,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    title: 'Two Sum',
    difficulty: 'Medium',
    topic: 'Arrays & Hash Tables',
    languages: ['JavaScript', 'Python', 'C++'],
    passRate: '78%',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution.',
  },
  {
    id: 'q2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack & String Parsing',
    languages: ['JavaScript', 'Python', 'C++'],
    passRate: '86%',
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid under matching bracket rules.',
  },
  {
    id: 'q3',
    title: 'LRU Cache Design',
    difficulty: 'Hard',
    topic: 'Data Structures & Design',
    languages: ['JavaScript', 'Python', 'C++'],
    passRate: '54%',
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.',
  },
  {
    id: 'q4',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    topic: 'Trees & BFS',
    languages: ['JavaScript', 'Python', 'C++'],
    passRate: '72%',
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
  },
  {
    id: 'q5',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topic: 'Heaps & Priority Queues',
    languages: ['JavaScript', 'Python', 'C++'],
    passRate: '49%',
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
  },
];

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    difficulty: 'Medium',
    topic: '',
    description: '',
  });

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDiff =
      difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newQuestion.title.trim()) return;

    const created = {
      id: 'q' + (questions.length + 1),
      title: newQuestion.title,
      difficulty: newQuestion.difficulty,
      topic: newQuestion.topic || 'General Algorithms',
      languages: ['JavaScript', 'Python', 'C++'],
      passRate: '100%',
      description: newQuestion.description,
    };

    setQuestions([created, ...questions]);
    setIsCreateModalOpen(false);
    setNewQuestion({
      title: '',
      difficulty: 'Medium',
      topic: '',
      description: '',
    });
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-arena-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-display">
            Assessment Question Bank
          </h1>
          <p className="text-xs text-arena-muted mt-0.5">
            Curate technical problems, configure test suites, and load questions into live interview sessions.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={Plus}
        >
          Add New Question
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-arena-dim" />
                <input
                  type="text"
                  placeholder="Filter questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs bg-arena-panel border border-arena-border rounded-md text-white placeholder-arena-dim w-48 sm:w-60 focus:outline-none focus:border-arena-blue"
                />
              </div>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-arena-panel border border-arena-border rounded-md text-white focus:outline-none"
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          }
        >
          <div className="font-semibold text-sm text-white">Repository ({filteredQuestions.length})</div>
          <div className="text-xs text-arena-muted">Pre-tested questions with Judge0 test validation</div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-arena-panel/60 border-b border-arena-border text-arena-dim uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Problem Name</th>
                <th className="py-3 px-4">Topic / Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Supported Languages</th>
                <th className="py-3 px-4">Avg Pass Rate</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border font-sans">
              {filteredQuestions.map((q) => (
                <tr
                  key={q.id}
                  className="hover:bg-arena-panel/40 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200 group-hover:text-blue-400 cursor-pointer" onClick={() => setPreviewQuestion(q)}>
                      {q.title}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-arena-muted">{q.topic}</td>

                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        q.difficulty === 'Easy'
                          ? 'emerald'
                          : q.difficulty === 'Medium'
                          ? 'amber'
                          : 'rose'
                      }
                      size="xs"
                    >
                      {q.difficulty}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-arena-dim">
                    <div className="flex gap-1 font-mono text-[10px]">
                      {q.languages.map((l) => (
                        <span key={l} className="bg-arena-panel px-1.5 py-0.5 rounded border border-arena-border">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-arena-muted">{q.passRate}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewQuestion(q)}
                        className="p-1 rounded text-arena-dim hover:text-white hover:bg-arena-panel transition-colors"
                        title="Preview Problem"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1 rounded text-arena-dim hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title={`Problem Preview: ${previewQuestion.title}`}
          subtitle={`Topic: ${previewQuestion.topic} • Difficulty: ${previewQuestion.difficulty}`}
        >
          <div className="space-y-3.5 text-xs text-slate-300">
            <p className="leading-relaxed">{previewQuestion.description}</p>
            <div className="p-3 bg-arena-panel rounded-lg border border-arena-border font-mono text-[11px] space-y-1">
              <div className="text-slate-400">Supported Compiler Runtime:</div>
              <div className="text-emerald-400">Node.js (v20), Python (3.11), GCC (C++20)</div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setPreviewQuestion(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Question to Repository"
        subtitle="Create a new problem statement with test cases"
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Problem Title"
            placeholder="e.g. Find Kth Largest Element"
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion((p) => ({ ...p, title: e.target.value }))
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={newQuestion.difficulty}
                onChange={(e) =>
                  setNewQuestion((p) => ({ ...p, difficulty: e.target.value }))
                }
                className="w-full px-2.5 py-1.5 text-xs bg-arena-panel border border-arena-border rounded text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <Input
              label="Topic / Category"
              placeholder="e.g. Heap, Graph, Dynamic Programming"
              value={newQuestion.topic}
              onChange={(e) =>
                setNewQuestion((p) => ({ ...p, topic: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Problem Description
            </label>
            <textarea
              rows={3}
              placeholder="Full problem text, examples, and constraints..."
              value={newQuestion.description}
              onChange={(e) =>
                setNewQuestion((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 text-xs bg-arena-panel border border-arena-border rounded text-white"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
