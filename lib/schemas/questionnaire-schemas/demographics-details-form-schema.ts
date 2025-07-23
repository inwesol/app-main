import { z } from "zod";

export const demographicsDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 1 && num <= 100;
    }, "Please enter a valid age between 1 and 100"),
  gender: z.enum(["male", "female", "prefer-not-to-say", "others"], {
    required_error: "Please select your gender",
  }),
  profession: z.enum(
    [
      "student-pursuing",
      "student-passed",
      "working-business",
      "working-employee",
    ],
    {
      required_error: "Please select your current status",
    }
  ),
  education: z
    .string()
    .min(5, "Please provide details about your education and field of study")
    .max(200, "Please keep education details under 200 characters"),
  stressLevel: z.number().min(1).max(10),
  previousCoaching: z.enum(["yes", "no"], {
    required_error:
      "Please indicate if you've had previous coaching or therapy",
  }),
  motivation: z
    .string()
    .min(20, "Please provide at least 20 characters describing your motivation")
    .max(1000, "Please keep motivation under 1000 characters"),
});

export type DemographicsDetailsFormData = z.infer<
  typeof demographicsDetailsSchema
>;
