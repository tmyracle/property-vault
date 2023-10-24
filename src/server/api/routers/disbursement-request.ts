//import { eq } from "drizzle-orm";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { disbursementRequests } from "~/server/db/schema";

export const disbursementRequestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        propertyOwnerId: z.number(),
        amount: z.string(),
        description: z.string(),
        distributeTo: z.enum(["property_owner", "forfeit"]),
        status: z.enum(["pending", "approved", "rejected"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(disbursementRequests).values({
        caseId: input.caseId,
        propertyOwnerId: input.propertyOwnerId,
        amount: input.amount.toString(),
        description: input.description,
        distributeTo: input.distributeTo,
        status: input.status,
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });
    }),
  getRequestsForCase: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.disbursementRequests.findMany({
        where: eq(disbursementRequests.caseId, input),
        with: {
          propertyOwner: true,
        },
      });
    }),

  getAllRequests: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.disbursementRequests.findMany({
      where: eq(disbursementRequests.orgId, ctx.auth.orgId!),
      with: {
        propertyOwner: true,
        case: true,
      },
    });
  }),
});
