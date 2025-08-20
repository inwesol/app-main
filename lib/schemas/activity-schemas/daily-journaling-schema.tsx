import { z } from "zod";

// Schema for individual bullet points
const bulletPointSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
});

// Main daily journaling schema
export const dailyJournalingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  tookAction: z.enum(["yes", "no", ""]).optional().default(""),
  whatHeldBack: z.string().optional().default(""),
  challenges: z.array(bulletPointSchema).default([]),
  progress: z.array(bulletPointSchema).default([]),
  gratitude: z.array(bulletPointSchema).max(3, "Maximum 3 gratitude items allowed").default([]),
  gratitudeHelp: z.array(bulletPointSchema).default([]),
  tomorrowStep: z.string().optional().default(""),
});

export type DailyJournalingData = z.infer<typeof dailyJournalingSchema>;
export type BulletPoint = z.infer<typeof bulletPointSchema>;