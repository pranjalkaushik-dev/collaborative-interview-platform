import { codingEvaluationChain } from "./prompt.js";
import { codingEvaluationSchema } from "./schema.js";
import { withRetry } from "../question-generator/retry.js";

import type {
  CodingEvaluation,
  CodingEvaluationRequest,
} from "./types.js";

export async function evaluateCodingSolution(
  request: CodingEvaluationRequest
): Promise<CodingEvaluation> {
  const response = await withRetry(() =>
    codingEvaluationChain.invoke({
      question: request.question,
      language: request.language,
      sourceCode: request.sourceCode,
      testResults: JSON.stringify(request.testResults, null, 2),
    })
  );

  return codingEvaluationSchema.parse(response);
}
