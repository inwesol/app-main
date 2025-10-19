import { z } from "zod";

export const lifeCollageSchema = z.object({
  // Present Life section
  presentLifeCollage: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("image"),
        content: z.string(),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        zIndex: z.number().default(1),
      })
    )
    .default([]),

  // Future Life section
  futureLifeCollage: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("image"),
        content: z.string(),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        zIndex: z.number().default(1),
      })
    )
    .default([]),

  retirementValues: z
    .string()
    .min(
      1,
      "Please describe the personal values you would speak about at your retirement party"
    ),
});

export type LifeCollageFormData = z.infer<typeof lifeCollageSchema>;
export type CollageElement = LifeCollageFormData["presentLifeCollage"][0];
