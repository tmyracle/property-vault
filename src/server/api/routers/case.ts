import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cases } from "~/server/db/schema";

export const caseRouter = createTRPCRouter({
  getAllCases: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.cases.findMany({
      where: eq(cases.orgId, ctx.auth.orgId!),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        caseNumber: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cases).values({
        name: input.name,
        caseNumber: input.caseNumber,
        description: input.description,
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });
    }),
});
