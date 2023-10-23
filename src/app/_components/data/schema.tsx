import { z } from "zod";

export const caseSchema = z.object({
  id: z.number(),
  name: z.string(),
  caseNumber: z.string(),
  description: z.string(),
});
