// schema.ts - export section
import { z } from "zod";

export const postCoachingAssessmentSchema = z.object({
  // All questions use a scale of 1-10, so we validate each as a number in that range
  "How clear are your career goals after coaching?": z.number().min(1).max(10),
  "How confident are you that you will achieve your career goals after coaching?":
    z.number().min(1).max(10),
  "How confident are you in your ability to overcome obstacles in your career after coaching?":
    z.number().min(1).max(10),
  "How would you rate your level of stress related to work or personal life after coaching?":
    z.number().min(1).max(10),
  "How well do you understand your own thought patterns and behaviors after coaching?":
    z.number().min(1).max(10),
  "How satisfied are you with your work-life balance after coaching?": z
    .number()
    .min(1)
    .max(10),
  "How satisfied are you with your job and overall well-being after coaching?":
    z.number().min(1).max(10),
  "How ready are you to make changes in your professional or personal life after coaching?":
    z.number().min(1).max(10),
  "How would you rate your overall experience with the coaching process?": z
    .number()
    .min(1)
    .max(10),
  "How effective was the relationship between you and your coach?": z
    .number()
    .min(1)
    .max(10),
  "Did you feel supported and understood by your coach?": z
    .number()
    .min(1)
    .max(10),
  "How much do you currently feel that you are using your strengths in your career?":
    z.number().min(1).max(10),
  "How much more do you feel that you are using your strengths in your career after coaching?":
    z.number().min(1).max(10),
});
