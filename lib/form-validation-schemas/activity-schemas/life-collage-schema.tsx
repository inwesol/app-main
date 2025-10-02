import { z } from "zod";

// Collage element schema
const collageElementSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "text", "shape"]),
  content: z.string(), // URL for images, text for text elements
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  zIndex: z.number(),
  style: z
    .object({
      color: z.string().optional(),
      fontSize: z.number().optional(),
      fontWeight: z.string().optional(),
      backgroundColor: z.string().optional(),
      borderRadius: z.number().optional(),
      opacity: z.number().optional(),
    })
    .optional(),
});

// Life collage schema
export const lifeCollageSchema = z.object({
  presentLifeCollage: z.array(collageElementSchema),
  futureLifeCollage: z.array(collageElementSchema),
});

export type LifeCollageFormData = z.infer<typeof lifeCollageSchema>;
export type CollageElement = z.infer<typeof collageElementSchema>;
