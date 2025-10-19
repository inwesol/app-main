import { z } from "zod";

export const careerStoryOneSchema = z.object({
  transitionEssay: z
    .string()
    .min(20, "Please write at least 20 characters about your transition"),
  occupations: z.string().min(1, "Please list at least one occupation"),
  heroes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Hero name is required"),
        description: z
          .string()
          .min(10, "Please provide a meaningful description"),
      })
    )
    .min(1, "Please add at least one hero"),
  mediaPreferences: z.string().min(1, "Please share your media preferences"),
  favoriteStory: z.string().min(20, "Please describe your favorite story"),
  favoriteSaying: z
    .string()
    .min(1, "Please share your favorite saying or motto"),
});

export type CareerStoryOneData = z.infer<typeof careerStoryOneSchema>;
