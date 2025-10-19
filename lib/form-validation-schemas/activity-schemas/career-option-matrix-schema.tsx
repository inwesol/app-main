import { z } from "zod";

// Matrix Cell Schema
const matrixCellSchema = z.object({
  rowId: z.string(),
  colId: z.string(),
  value: z.number().min(0).max(5),
  comment: z.string(),
});

// Matrix Row Schema (Career Options - no weights)
const matrixRowSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Matrix Column Schema (Criteria - no weights)
const matrixColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  disabled: z.boolean(),
});

// Main Career Options Matrix Schema
export const careerOptionsMatrixSchema = z.object({
  rows: z.array(matrixRowSchema),
  columns: z.array(matrixColumnSchema),
  cells: z.array(matrixCellSchema),
});

export type CareerOptionsMatrixData = z.infer<typeof careerOptionsMatrixSchema>;
export type MatrixCell = z.infer<typeof matrixCellSchema>;
export type MatrixRow = z.infer<typeof matrixRowSchema>;
export type MatrixColumn = z.infer<typeof matrixColumnSchema>;
