export type InterviewType =
  | "CODING"
  | "MCQ"
  | "TEXT";

export type Difficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export interface QuestionGenerationRequest {
  role: string;
  skills: string[];
  difficulty: Difficulty;
  type: InterviewType;
  numberOfQuestions: number;
}

export interface BaseGeneratedQuestion {
  prompt: string;
  topic: string;
  difficulty: Difficulty;
  expectedKeywords: string[];
}

export interface TextQuestion extends BaseGeneratedQuestion {
  type: "TEXT";
}

export interface McqQuestion extends BaseGeneratedQuestion {
  type: "MCQ";
  options: string[];
  correctOptionIndex: number;
}

export interface GeneratedTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string | undefined;
}

export interface CodingQuestion extends BaseGeneratedQuestion {
  type: "CODING";

  constraints: string[];

  examples: CodingExample[];

  testCases: GeneratedTestCase[];
}

export interface CodingExample {
  input: string;
  output: string;
  explanation?: string | undefined;
}

export type GeneratedQuestion =
  | TextQuestion
  | McqQuestion
  | CodingQuestion;

export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[];
}