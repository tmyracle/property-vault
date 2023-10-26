import { z } from "zod";

export const depositSchema = z.object({
  id: z.number(),
  itemNumber: z.string(),
  amount: z.string(),
  description: z.string(),
});
