import { z } from "zod";

export const codingEvaluationSchema = z.object({
  timeComplexity: z.string().nullable(),
  spaceComplexity: z.string().nullable(),

  codeQualityScore: z
    .number()
    .min(0)
    .max(100)
    .nullable(),

  summary: z.string().nullable(),

  suggestions: z
    .array(z.string().min(1)),
});

export const codingEvaluationJsonSchema =
  z.toJSONSchema(codingEvaluationSchema);
