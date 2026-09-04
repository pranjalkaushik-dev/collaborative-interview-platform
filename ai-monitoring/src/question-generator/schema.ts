import { z } from "zod";

const baseQuestionFields = {
  prompt: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  expectedKeywords: z.array(z.string()),
};

export const textQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal("TEXT"),
});

export const mcqQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal("MCQ"),
  options: z.array(z.string().min(1)).length(4),
  correctOptionIndex: z.number().int().min(0).max(3),
});

export const generatedTestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanation: z.string().optional(),
});

export const codingExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

export const codingQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal("CODING"),

  constraints: z.array(z.string().min(1)).min(1),

  examples: z.array(codingExampleSchema).min(1),

  testCases: z.array(generatedTestCaseSchema).min(1),
});

export const generatedQuestionSchema = z.discriminatedUnion("type", [
  textQuestionSchema,
  mcqQuestionSchema,
  codingQuestionSchema,
]);

export const questionGenerationResponseSchema = z.object({
  questions: z.array(generatedQuestionSchema),
});

export const questionGenerationJsonSchema =
  z.toJSONSchema(questionGenerationResponseSchema);


const langChainCodingExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

const langChainGeneratedTestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  explanation: z.string().optional(),
});

const langChainCodingQuestionSchema = z.object({
  prompt: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  expectedKeywords: z.array(z.string()),
  type: z.string(),
  constraints: z.array(z.string().min(1)).min(1),
  examples: z.array(langChainCodingExampleSchema).min(2),
  testCases: z.array(langChainGeneratedTestCaseSchema).min(3),
});

export const langChainQuestionGenerationSchema = z.object({
  questions: z.array(langChainCodingQuestionSchema),
});
