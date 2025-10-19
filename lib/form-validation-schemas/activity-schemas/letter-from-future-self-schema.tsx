import { z } from "zod";

export const letterFromFutureSelfSchema = z.object({
  letter: z.string().min(1, "Letter content is required"),
});