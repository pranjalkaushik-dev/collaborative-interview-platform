import React, { useState } from 'react';
import Badge from '../ui/Badge';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  AlertCircle,
} from 'lucide-react';

export default function QuestionPane() {
  const [activeTab, setActiveTab] = useState('description');
  const [hintsOpen, setHintsOpen] = useState(false);

  return (
    <div className="h-full bg-arena-surface border-r border-arena-border flex flex-col text-xs text-slate-300 select-text overflow-hidden">
      {/* Pane Header Tabs */}
      <div className="h-9 bg-arena-panel border-b border-arena-border px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'description'
                ? 'bg-arena-card text-white font-semibold'
                : 'text-arena-muted hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Problem</span>
          </button>
          <button
            onClick={() => setActiveTab('testcases')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'testcases'
                ? 'bg-arena-card text-white font-semibold'
                : 'text-arena-muted hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Test Cases (2)</span>
          </button>
        </div>

        <Badge variant="amber" size="xs">
          Medium
        </Badge>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'description' ? (
          <>
            {/* Title & Metadata */}
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white font-display">
                1. Two Sum Problem
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-arena-dim">
                <span>Topics: Hash Table, Arrays</span>
                <span>&bull;</span>
                <span>Time: O(N)</span>
              </div>
            </div>

            {/* Problem Statement Body */}
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                Given an array of integers <code className="bg-arena-panel border border-arena-border px-1 py-0.5 rounded text-white font-mono text-[11px]">nums</code> and an integer <code className="bg-arena-panel border border-arena-border px-1 py-0.5 rounded text-white font-mono text-[11px]">target</code>, return indices of the two numbers such that they add up to <code className="bg-arena-panel border border-arena-border px-1 py-0.5 rounded text-white font-mono text-[11px]">target</code>.
              </p>
              <p>
                You may assume that each input would have <strong className="text-white">exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.
              </p>
            </div>

            {/* Formatted Examples */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white">Example 1:</div>
              <div className="p-3 bg-arena-panel rounded-lg border border-arena-border font-mono text-[11px] space-y-1">
                <div>
                  <span className="text-arena-dim">Input: </span>
                  <span className="text-white">nums = [2,7,11,15], target = 9</span>
                </div>
                <div>
                  <span className="text-arena-dim">Output: </span>
                  <span className="text-emerald-400 font-semibold">[0, 1]</span>
                </div>
                <div className="text-arena-dim text-[10px] pt-1 border-t border-arena-border">
                  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                </div>
              </div>

              <div className="text-xs font-semibold text-white">Example 2:</div>
              <div className="p-3 bg-arena-panel rounded-lg border border-arena-border font-mono text-[11px] space-y-1">
                <div>
                  <span className="text-arena-dim">Input: </span>
                  <span className="text-white">nums = [3,2,4], target = 6</span>
                </div>
                <div>
                  <span className="text-arena-dim">Output: </span>
                  <span className="text-emerald-400 font-semibold">[1, 2]</span>
                </div>
              </div>
            </div>

            {/* Constraints Checklist */}
            <div className="pt-2 border-t border-arena-border space-y-1.5">
              <div className="text-xs font-semibold text-white">Constraints:</div>
              <ul className="space-y-1 text-[11px] font-mono text-arena-muted list-disc list-inside">
                <li><code className="text-slate-200">2 &lt;= nums.length &lt;= 10⁴</code></li>
                <li><code className="text-slate-200">-10⁹ &lt;= nums[i] &lt;= 10⁹</code></li>
                <li><code className="text-slate-200">-10⁹ &lt;= target &lt;= 10⁹</code></li>
                <li>Only one valid answer exists.</li>
              </ul>
            </div>

            {/* Collapsible Hints Accordion */}
            <div className="border border-arena-border rounded-lg bg-arena-panel overflow-hidden">
              <button
                onClick={() => setHintsOpen(!hintsOpen)}
                className="w-full p-2.5 flex items-center justify-between text-xs font-medium text-slate-200 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Algorithmic Hint</span>
                </span>
                {hintsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {hintsOpen && (
                <div className="p-3 border-t border-arena-border text-[11px] text-arena-muted leading-relaxed bg-arena-surface">
                  Can you solve this in O(N) time? A brute force approach checks all pairs in O(N²). By utilizing an auxiliary hash map, you can check if the complement (<code className="text-white">target - nums[i]</code>) exists in O(1) time.
                </div>
              )}
            </div>
          </>
        ) : (
          /* Test Cases Tab */
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white">Pre-configured Test Suite</div>
            <div className="p-3 rounded-lg bg-arena-panel border border-arena-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-200">Case 1 (Standard)</span>
                <Badge variant="emerald" size="xs">Ready</Badge>
              </div>
              <div className="font-mono text-[11px] space-y-1">
                <div className="text-arena-dim">Input: nums = [2,7,11,15], target = 9</div>
                <div className="text-arena-dim">Expected: [0, 1]</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-arena-panel border border-arena-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-200">Case 2 (Duplicates & Target)</span>
                <Badge variant="emerald" size="xs">Ready</Badge>
              </div>
              <div className="font-mono text-[11px] space-y-1">
                <div className="text-arena-dim">Input: nums = [3,3], target = 6</div>
                <div className="text-arena-dim">Expected: [0, 1]</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
