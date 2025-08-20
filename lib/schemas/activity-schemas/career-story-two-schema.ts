import { z } from "zod";

export const careerStoryTwoSchema = z.object({
  firstAdjectives: z.string().min(1, "First adjectives are required"),
  repeatedWords: z.string().min(1, "Repeated words are required"),
  commonTraits: z.string().min(1, "Common traits are required"),
  significantWords: z.string().min(1, "Significant words are required"),
  selfStatement: z.string().min(1, "Self statement is required"),
  mediaActivities: z
    .string()
    .min(1, "Media activities description is required"),
  selectedRiasec: z
    .array(z.string())
    .min(1, "At least one RIASEC code must be selected"),
  settingStatement: z.string().min(1, "Setting statement is required"),
});

export type CareerStoryTwoData = z.infer<typeof careerStoryTwoSchema>;
