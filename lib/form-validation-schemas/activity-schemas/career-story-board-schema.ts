import { z } from "zod";

// Schema for individual sticky note
export const stickyNoteSchema = z.object({
  id: z.string().min(1, "Sticky note ID is required"),
  content: z.string().max(500, "Content must be less than 500 characters"),
  color: z.string().min(1, "Color is required"),
  position: z.object({
    x: z
      .number()
      .min(0, "X position must be non-negative")
      .max(2000, "X position too large"),
    y: z
      .number()
      .min(0, "Y position must be non-negative")
      .max(2000, "Y position too large"),
  }),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val);
    }
    return val;
  }),
});

// Schema for the complete career story board
export const careerStoryBoardSchema = z.object({
  stickyNotes: z
    .array(stickyNoteSchema)
    .max(50, "Maximum 50 sticky notes allowed"),
});

// Type exports
export type StickyNote = z.infer<typeof stickyNoteSchema>;
export type CareerStoryBoardData = z.infer<typeof careerStoryBoardSchema>;
