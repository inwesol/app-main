import { z } from "zod";

export const careerStoryThreeSchema = z.object({
  selfStatement: z.string().min(1, "Self statement is required"),
  settingStatement: z.string().min(1, "Setting statement is required"),
  plotDescription: z.string().min(1, "Plot description is required"),
  plotActivities: z.string().min(1, "Plot activities are required"),
  ableToBeStatement: z.string().min(1, "Able to be statement is required"),
  placesWhereStatement: z.string().min(1, "Places where statement is required"),
  soThatStatement: z.string().min(1, "So that statement is required"),
  mottoStatement: z.string().min(1, "Motto statement is required"),
  selectedOccupations: z
    .array(z.string())
    .min(1, "At least one occupation must be selected"),
});

export type CareerStoryThreeData = z.infer<typeof careerStoryThreeSchema>;
