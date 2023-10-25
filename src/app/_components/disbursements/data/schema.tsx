import { z } from "zod";

export const disbursementRequestSchema = z.object({
  id: z.number(),
});
