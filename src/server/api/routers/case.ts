import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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
        disbursementRequests: true,
      },
    });
  }),

  getCaseNumbers: protectedProcedure.query(async ({ ctx }) => {
    const caseFragments = await ctx.db.query.cases.findMany({
      where: eq(cases.orgId, ctx.auth.orgId!),
      columns: {
        id: true,
        caseNumber: true,
      },
    });
    return caseFragments.map((fragment) => {
      return {
        label: fragment.caseNumber,
        value: fragment.id.toString(),
      };
    });
  }),

  getCase: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.cases.findFirst({
      where: eq(cases.slug, input),
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
      const createdCase = await ctx.db.insert(cases).values({
        name: input.name,
        caseNumber: input.caseNumber,
        description: input.description,
        caseDate: input.caseDate,
        slug: uuidv4(),
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });

      return ctx.db.query.cases.findFirst({
        where: and(
          eq(cases.id, Number(createdCase.insertId)),
          eq(cases.orgId, ctx.auth.orgId!),
        ),
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
