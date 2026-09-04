import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../llm.js";
import { langChainQuestionGenerationSchema } from "./schema.js";

export const questionGenerationPrompt =
  ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an expert technical interviewer.

Generate high-quality interview questions based on the candidate's role,
skills, difficulty, and requested question type.

GENERAL RULES:
- Follow the requested difficulty exactly.
- Follow the requested question type exactly.
- Generate exactly the requested number of questions.
- Questions must be unique.
- Questions must be technically accurate.
- Include expected keywords/concepts.
- Do not generate duplicate or substantially similar questions.
- Do not include markdown.
- Return only the requested structured data.

CODING QUESTION RULES:
- Generate DSA and algorithmic problem-solving questions.
- Do NOT generate backend implementation tasks.
- Every CODING question MUST include:
  1. constraints
  2. at least 2 examples
  3. at least 3 test cases
- Examples must contain input and output.
- Test cases must contain input and expectedOutput.
- Include useful algorithmic constraints.
- The problem should be solvable as a programming/DSA problem.

MCQ QUESTION RULES:
- Every MCQ question MUST contain exactly 4 options.
- correctOptionIndex must identify the correct option using zero-based indexing.

TEXT QUESTION RULES:
- Generate a conceptual or technical interview question.
- Include relevant expected keywords/concepts.`,
    ],
    [
      "human",
      `Role: {role}

Skills:
{skills}

Difficulty:
{difficulty}

Question Type:
{type}

Number of Questions:
{numberOfQuestions}

Previously Generated Questions:
{previousQuestions}

Generate the requested questions now.`,
    ],
  ]);


export const questionGenerationChain =
  questionGenerationPrompt.pipe(
    llm.withStructuredOutput(
      langChainQuestionGenerationSchema
    )
  );
