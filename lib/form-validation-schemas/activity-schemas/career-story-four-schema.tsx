import { z } from "zod";

export const careerStoryFourSchema = z.object({
  rewrittenStory: z
    .string()
    .min(100, "Your rewritten story must be at least 100 characters long")
    .max(2000, "Your rewritten story must be less than 2000 characters")
    .refine(
      (value) => value.trim().split(/\s+/).length >= 50,
      "Your rewritten story should be at least 50 words long"
    ),
});

export type CareerStoryFour = z.infer<typeof careerStoryFourSchema>;