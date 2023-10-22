import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export const caseSchema = z.object({
  id: z.number(),
  name: z.string(),
  caseNumber: z.string(),
  description: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
