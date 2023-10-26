//import { eq } from "drizzle-orm";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addresses, deposits, propertyOwners } from "~/server/db/schema";

export const depositRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        amount: z.string(),
        itemNumber: z.string(),
        description: z.string(),
        propertyOwner: z.object({
          name: z.string(),
          phone: z.string(),
          email: z.string().nullable(),
        }),
        address: z.object({
          street: z.string(),
          unit: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const propertyOwner = await ctx.db.insert(propertyOwners).values({
        name: input.propertyOwner.name,
        phone: input.propertyOwner.phone,
        email: input.propertyOwner.email,
        createdBy: ctx.auth.userId,
        orgId: ctx.auth.orgId!,
      });

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

      await ctx.db.insert(deposits).values({
        caseId: input.caseId,
        propertyOwnerId: Number(propertyOwner.insertId),
        amount: input.amount.toString(),
        itemNumber: input.itemNumber,
        description: input.description,
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
});
