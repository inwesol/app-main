import { z } from "zod";

// SDQ (Strengths and Difficulties Questionnaire) response options
const sdqResponseType = z.enum(["Not True", "Somewhat True", "Certainly True"]);

// Impact assessment response options
const impactResponseType = z.enum([
  "No",
  "Yes - minor difficulties",
  "Yes - definite difficulties",
  "Yes - severe difficulties",
]);
const durationResponseType = z.enum([
  "Less than a month",
  "1 - 5 months",
  "6-12 months",
  "Over a year",
]);
const impactLevelResponseType = z.enum([
  "Not at all",
  "Only a little",
  "A medium amount",
  "A great deal",
]);

// Create schema for all 25 SDQ questions + impact questions
export const postCoachingSdqSchema = z
  .object({
    q1: sdqResponseType.optional(),
    q2: sdqResponseType.optional(),
    q3: sdqResponseType.optional(),
    q4: sdqResponseType.optional(),
    q5: sdqResponseType.optional(),
    q6: sdqResponseType.optional(),
    q7: sdqResponseType.optional(),
    q8: sdqResponseType.optional(),
    q9: sdqResponseType.optional(),
    q10: sdqResponseType.optional(),
    q11: sdqResponseType.optional(),
    q12: sdqResponseType.optional(),
    q13: sdqResponseType.optional(),
    q14: sdqResponseType.optional(),
    q15: sdqResponseType.optional(),
    q16: sdqResponseType.optional(),
    q17: sdqResponseType.optional(),
    q18: sdqResponseType.optional(),
    q19: sdqResponseType.optional(),
    q20: sdqResponseType.optional(),
    q21: sdqResponseType.optional(),
    q22: sdqResponseType.optional(),
    q23: sdqResponseType.optional(),
    q24: sdqResponseType.optional(),
    q25: sdqResponseType.optional(),
    // Impact assessment questions
    q26: impactResponseType.optional(),
    q26a: durationResponseType.optional(),
    q26b: impactLevelResponseType.optional(),
    q26c: impactLevelResponseType.optional(),
    q26d: impactLevelResponseType.optional(),
    q26e: impactLevelResponseType.optional(),
    q26f: impactLevelResponseType.optional(),
    q26g: impactLevelResponseType.optional(),
  })
  .refine((data) => {
    // Conditional validation: if q26 is not "No", then q26a-q26g are required
    if (data.q26 && data.q26 !== "No") {
      return (
        data.q26a &&
        data.q26b &&
        data.q26c &&
        data.q26d &&
        data.q26e &&
        data.q26f &&
        data.q26g
      );
    }
    return true;
  });

export type PostCoachingSdqData = z.infer<typeof postCoachingSdqSchema>;

// SDQ scoring configuration
export const sdqScoringConfig = {
  // Questions that are reverse scored (lower score = more problems)
  reverseScoredQuestions: [7, 11, 14, 21, 25],

  // Subscale mappings
  subscales: {
    emotionalSymptoms: [3, 8, 13, 16, 24],
    conductProblems: [5, 7, 12, 18, 22],
    hyperactivityInattention: [2, 10, 15, 21, 25],
    peerProblems: [6, 11, 14, 19, 23],
    prosocialBehavior: [1, 4, 9, 17, 20],
  },

  // Response value mapping
  responseValues: {
    "Not True": 0,
    "Somewhat True": 1,
    "Certainly True": 2,
  },
} as const;

// Impact assessment scoring configuration
export const impactScoringConfig = {
  // Impact level response values (for questions q26b-q26f)
  impactResponseValues: {
    "Not at all": 0,
    "Only a little": 0,
    "A medium amount": 1,
    "A great deal": 2,
  },

  // Questions that contribute to impact score (q26b through q26f)
  impactQuestions: ["q26b", "q26c", "q26d", "q26e", "q26f"],
} as const;
