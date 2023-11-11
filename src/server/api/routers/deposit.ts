//import { eq } from "drizzle-orm";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addresses, deposits, propertyOwners } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";

export const depositRouter = createTRPCRouter({
  getAllDeposits: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.deposits.findMany({
      where: eq(deposits.orgId, ctx.auth.orgId!),
      with: {
        propertyOwner: {
          with: {
            addresses: true,
          },
        },
        case: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        amount: z.string(),
        itemNumber: z.string(),
        description: z.string(),
        propertyOwner: z
          .object({
            name: z.string(),
            phone: z.string(),
            email: z.string().nullable(),
          })
          .optional(),
        address: z
          .object({
            street: z.string(),
            unit: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let propertyOwner = null;
      if (input.propertyOwner) {
        propertyOwner = await ctx.db.insert(propertyOwners).values({
          name: input.propertyOwner.name,
          phone: input.propertyOwner.phone,
          email: input.propertyOwner.email,
          createdBy: ctx.auth.userId,
          orgId: ctx.auth.orgId!,
        });
      }

      if (input.address && propertyOwner) {
        await ctx.db.insert(addresses).values({
          street: input.address.street,
          unit: input.address.unit,
          city: input.address.city,
          state: input.address.state,
          zip: input.address.zip,
          ownerId: Number(propertyOwner.insertId),
          createdBy: ctx.auth.userId,
          orgId: ctx.auth.orgId!,
        });
      }

      await ctx.db.insert(deposits).values({
        caseId: input.caseId,
        propertyOwnerId: Number(propertyOwner?.insertId) ?? null,
        amount: input.amount.toString(),
        itemNumber: input.itemNumber,
        description: input.description,
        slug: uuidv4(),
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });
    }),

  getRecent: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.deposits.findMany({
      where: eq(deposits.orgId, ctx.auth.orgId!),
      orderBy: [desc(deposits.createdAt)],
      limit: 10,
      with: {
        propertyOwner: {
          with: {
            addresses: true,
          },
        },
        case: true,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        amount: z.string(),
        itemNumber: z.string().nullable(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(deposits)
        .set({
          amount: input.amount,
          itemNumber: input.itemNumber,
          description: input.description,
        })
        .where(eq(deposits.id, input.id));
    }),

  getFilterData: protectedProcedure.query(async ({ ctx }) => {
    const depositResults = await ctx.db.query.deposits.findMany({
      where: eq(deposits.orgId, ctx.auth.orgId!),
      with: {
        case: true,
        propertyOwner: true,
      },
    });

    const uniqueCaseNumbers = depositResults
      .map((request) => request.case.caseNumber)
      .filter((value, index, self) => self.indexOf(value) === index);

    return {
      caseNumbers: uniqueCaseNumbers,
    };
  }),
});
