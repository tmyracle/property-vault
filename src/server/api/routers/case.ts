import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cases } from "~/server/db/schema";

export const caseRouter = createTRPCRouter({
  getAllCases: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.cases.findMany({
      where: eq(cases.orgId, ctx.auth.orgId!),
      with: {
        deposits: true,
      },
    });
  }),

  getCase: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.cases.findFirst({
      where: eq(cases.id, input),
      with: {
        deposits: {
          with: {
            propertyOwner: {
              with: {
                addresses: true,
              },
            },
          },
        },
        disbursementRequests: {
          with: {
            propertyOwner: true,
          },
        },
        disbursements: true,
      },
    });
    if (result && result.orgId !== ctx.auth.orgId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return result;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        caseNumber: z.string(),
        description: z.string().nullable(),
        caseDate: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cases).values({
        name: input.name,
        caseNumber: input.caseNumber,
        description: input.description,
        caseDate: input.caseDate,
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        caseNumber: z.string(),
        description: z.string().nullable(),
        caseDate: z.date().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(cases)
        .set({
          name: input.name,
          caseNumber: input.caseNumber,
          description: input.description,
          caseDate: input.caseDate,
        })
        .where(eq(cases.id, input.id));
    }),
});
