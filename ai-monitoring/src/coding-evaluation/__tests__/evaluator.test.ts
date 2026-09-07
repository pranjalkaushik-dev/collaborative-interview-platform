import { describe, expect, it, vi } from "vitest";

const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
}));

vi.mock("../prompt.js", () => ({
  codingEvaluationChain: {
    invoke: invokeMock,
  },
}));

import { evaluateCodingSolution } from "../evaluator.js";

describe("Coding Evaluator", () => {
  it("evaluates a coding solution", async () => {
    invokeMock.mockResolvedValue({
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      codeQualityScore: 90,
      summary: "The solution correctly processes the input.",
      suggestions: ["Improve variable naming."],
    });

    const result = await evaluateCodingSolution({
      question: "Find the maximum value in an array.",
      sourceCode: `
        const max = Math.max(...arr);
        console.log(max);
      `,
      language: "javascript",
      testResults: [
        {
          testCaseId: "1",
          input: "[1, 5, 3]",
          expectedOutput: "5",
          actualOutput: "5",
          passed: true,
          executionTime: "0.027",
          memory: 8136,
        },
      ],
    });

    expect(result).toEqual({
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      codeQualityScore: 90,
      summary: "The solution correctly processes the input.",
      suggestions: ["Improve variable naming."],
    });

    expect(invokeMock).toHaveBeenCalledOnce();

    expect(invokeMock.mock.calls[0]?.[0]).toMatchObject({
      question: "Find the maximum value in an array.",
      language: "javascript",
      sourceCode: expect.stringContaining("Math.max"),
      testResults: expect.stringContaining('"passed": true'),
    });
  });

  it("allows unknown complexity and nullable fields", async () => {
    invokeMock.mockResolvedValue({
      timeComplexity: null,
      spaceComplexity: null,
      codeQualityScore: null,
      summary: null,
      suggestions: [],
    });

    const result = await evaluateCodingSolution({
      question: "Implement the required solution.",
      sourceCode: "console.log('test');",
      language: "javascript",
      testResults: [],
    });

    expect(result.timeComplexity).toBeNull();
    expect(result.spaceComplexity).toBeNull();
    expect(result.codeQualityScore).toBeNull();
    expect(result.summary).toBeNull();
    expect(result.suggestions).toEqual([]);
  });

  it("throws when the evaluation chain returns invalid output", async () => {
    invokeMock.mockResolvedValue({
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      codeQualityScore: 150,
      summary: "Invalid score.",
      suggestions: [],
    });

    await expect(
      evaluateCodingSolution({
        question: "Find the maximum.",
        sourceCode: "console.log(1);",
        language: "javascript",
        testResults: [],
      })
    ).rejects.toThrow();
  });
});
