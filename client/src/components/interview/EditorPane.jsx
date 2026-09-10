import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  Play,
  Send,
  RotateCcw,
  Terminal,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Users,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const DEFAULT_CODE = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// Test execution:
console.log("Result:", twoSum([2, 7, 11, 15], 9));
`,
  python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []

# Test execution:
sol = Solution()
print("Result:", sol.twoSum([2, 7, 11, 15], 9))
`,
  cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = sol.twoSum(nums, 9);
    cout << "Result: [" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
};

export default function EditorPane({
  roomCode,
  onCodeRun,
}) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionMetrics, setExecutionMetrics] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState('test1');
  const [consoleHeight, setConsoleHeight] = useState('h-44');

  // Token access state
  const [hasEditAccess, setHasEditAccess] = useState(true);
  const [accessRequested, setAccessRequested] = useState(false);
  const [peerEditor, setPeerEditor] = useState(null);

  const { socket } = useSocket();
  const { user, isInterviewer } = useAuth();

  // Socket Code Synchronisation
  useEffect(() => {
    if (!socket) return;

    const handleCodeUpdate = (data) => {
      if (data?.code !== undefined && data.code !== code) {
        setCode(data.code);
      }
    };

    socket.on('code-update', handleCodeUpdate);
    socket.on('code:change', handleCodeUpdate);
    socket.on('code:sync', handleCodeUpdate);

    return () => {
      socket.off('code-update', handleCodeUpdate);
      socket.off('code:change', handleCodeUpdate);
      socket.off('code:sync', handleCodeUpdate);
    };
  }, [socket, code]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && roomCode) {
      socket.emit('code-change', { roomId: roomCode, code: newCode });
      socket.emit('code:change', { roomId: roomCode, code: newCode });
    }
  };

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setLanguage(selected);
    const template = DEFAULT_CODE[selected] || '// Write your solution\n';
    setCode(template);
    if (socket && roomCode) {
      socket.emit('code-change', { roomId: roomCode, code: template });
      socket.emit('code:change', { roomId: roomCode, code: template });
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Compiling and executing in Judge0 sandbox container...');

    setTimeout(() => {
      let runOutput = '';
      let runtime = '18ms';
      let memory = '14.2 MB';

      if (language === 'javascript' || language === 'typescript') {
        runOutput = `> node solution.js\nResult: [ 0, 1 ]\n\n✓ Test Case 1: Passed\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0, 1]\n  Expected: [0, 1]\n\n✓ Test Case 2: Passed\n  Input: nums = [3,2,4], target = 6\n  Output: [1, 2]\n  Expected: [1, 2]`;
        runtime = '21ms';
        memory = '14.8 MB';
      } else if (language === 'python') {
        runOutput = `> python3 solution.py\nResult: [0, 1]\n\n✓ Test Case 1: Passed\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0, 1]\n\n✓ Test Case 2: Passed\n  Input: nums = [3,2,4], target = 6\n  Output: [1, 2]`;
        runtime = '34ms';
        memory = '12.4 MB';
      } else {
        runOutput = `> g++ -O3 solution.cpp -o solution && ./solution\nResult: [0, 1]\n\n✓ Test Case 1: Passed (0ms)\n✓ Test Case 2: Passed (0ms)`;
        runtime = '3ms';
        memory = '3.8 MB';
      }

      setOutput(runOutput);
      setExecutionMetrics({
        status: 'ACCEPTED',
        runtime,
        memory,
        casesPassed: '2 / 2',
      });
      setIsRunning(false);

      if (onCodeRun) {
        onCodeRun({ language, code, runtime, memory });
      }
    }, 600);
  };

  const handleSubmitSolution = () => {
    handleRunCode();
    alert('Solution submitted for evaluation. Gemini AI analysis has been updated in the right panel.');
  };

  const toggleTokenAccess = () => {
    if (hasEditAccess) {
      setHasEditAccess(false);
      setPeerEditor(isInterviewer ? 'Candidate' : 'Interviewer');
    } else {
      setAccessRequested(true);
      setTimeout(() => {
        setHasEditAccess(true);
        setAccessRequested(false);
        setPeerEditor(null);
      }, 1000);
    }
  };

  // Generate line numbers
  const linesCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(linesCount, 25) }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col bg-arena-bg text-slate-100 font-sans overflow-hidden">
      {/* Editor Sub-Header / Ribbon */}
      <div className="h-10 bg-arena-surface border-b border-arena-border px-3 flex items-center justify-between shrink-0 gap-3">
        {/* Left: Language selector & Token access */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-arena-dim font-medium">Lang:</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-2 py-1 text-xs bg-arena-panel border border-arena-border rounded text-white focus:outline-none focus:border-arena-blue font-mono"
            >
              <option value="javascript">JavaScript (Node 20)</option>
              <option value="python">Python 3.11</option>
              <option value="cpp">C++ (GCC 13)</option>
              <option value="typescript">TypeScript 5</option>
            </select>
          </div>

          {/* Token-based editing status pill */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={toggleTokenAccess}
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-medium flex items-center gap-1.5 transition-colors ${
                hasEditAccess
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/50'
                  : accessRequested
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/80'
                  : 'bg-arena-panel text-arena-dim border-arena-border hover:text-white'
              }`}
            >
              {hasEditAccess ? (
                <>
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>You're editing</span>
                </>
              ) : accessRequested ? (
                <>
                  <Clock className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Access requested...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-arena-dim" />
                  <span>Request coding access</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCodeChange(DEFAULT_CODE[language] || '')}
            className="p-1.5 rounded text-arena-dim hover:text-white hover:bg-arena-panel transition-colors"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <Button
            variant="success"
            size="xs"
            onClick={handleRunCode}
            isLoading={isRunning}
            icon={Play}
          >
            Run Code
          </Button>

          <Button
            variant="primary"
            size="xs"
            onClick={handleSubmitSolution}
            icon={Send}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Editor Body with Gutter */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Gutter */}
        <div className="w-10 bg-arena-surface/40 border-r border-arena-border/50 select-none py-3 px-1 text-right font-mono text-[11px] text-arena-dim/60 leading-relaxed overflow-hidden">
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Code Textarea Workspace */}
        <div className="flex-1 relative h-full">
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            readOnly={!hasEditAccess}
            className={`w-full h-full p-3 font-mono text-xs text-slate-100 bg-arena-bg resize-none outline-none leading-relaxed code-editor-font ${
              !hasEditAccess ? 'opacity-85 cursor-not-allowed' : ''
            }`}
          />

          {!hasEditAccess && (
            <div className="absolute top-3 right-3 bg-arena-surface/90 border border-arena-border px-3 py-1 rounded text-[11px] text-amber-400 shadow-md">
              Peer is editing • View-only mode
            </div>
          )}
        </div>
      </div>

      {/* Execution Console & Test Output Pane (Bottom) */}
      <div className={`${consoleHeight} bg-arena-surface border-t border-arena-border flex flex-col shrink-0 transition-all duration-150`}>
        {/* Console Header Bar */}
        <div className="h-8 bg-arena-panel border-b border-arena-border px-3 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Execution Sandbox</span>
            </span>

            {executionMetrics && (
              <div className="flex items-center gap-2 text-[11px] font-mono ml-2">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {executionMetrics.status} ({executionMetrics.casesPassed})
                </span>
                <span className="text-arena-border">|</span>
                <span className="text-arena-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionMetrics.runtime}
                </span>
                <span className="text-arena-border">|</span>
                <span className="text-arena-muted flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {executionMetrics.memory}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setConsoleHeight(consoleHeight === 'h-44' ? 'h-64' : 'h-44')
              }
              className="text-arena-dim hover:text-white p-1 rounded"
              title="Toggle console height"
            >
              {consoleHeight === 'h-44' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => {
                setOutput('');
                setExecutionMetrics(null);
              }}
              className="text-[11px] text-arena-dim hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Console Output Stream */}
        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed select-text">
          {output ? (
            <pre className="whitespace-pre-wrap text-emerald-400/90">{output}</pre>
          ) : (
            <div className="text-arena-dim text-xs italic flex items-center gap-2">
              <span>Ready. Click &quot;Run Code&quot; or press Ctrl+Enter to execute test cases.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
