import { z } from "zod";

// Define the response type
const ResponseType = z.enum(["agree", "disagree"]).nullable();

// Create schema for all 24 questions
export const careerAssessmentSchema = z.object({
  q1: ResponseType.optional(),
  q2: ResponseType.optional(),
  q3: ResponseType.optional(),
  q4: ResponseType.optional(),
  q5: ResponseType.optional(),
  q6: ResponseType.optional(),
  q7: ResponseType.optional(),
  q8: ResponseType.optional(),
  q9: ResponseType.optional(),
  q10: ResponseType.optional(),
  q11: ResponseType.optional(),
  q12: ResponseType.optional(),
  q13: ResponseType.optional(),
  q14: ResponseType.optional(),
  q15: ResponseType.optional(),
  q16: ResponseType.optional(),
  q17: ResponseType.optional(),
  q18: ResponseType.optional(),
  q19: ResponseType.optional(),
  q20: ResponseType.optional(),
  q21: ResponseType.optional(),
  q22: ResponseType.optional(),
  q23: ResponseType.optional(),
  q24: ResponseType.optional(),
});

export type CareerAssessmentData = z.infer<typeof careerAssessmentSchema>;

// Schema for validating page completion
export const createPageValidationSchema = (questionIds: string[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  questionIds.forEach((id) => {
    schemaObject[id] = z.enum(["agree", "disagree"], {
      required_error: "Please select an answer for this question",
    });
  });

  return z.object(schemaObject);
};
