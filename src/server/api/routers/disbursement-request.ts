//import { eq } from "drizzle-orm";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  disbursementRequests,
  cases,
  propertyOwners,
  addresses,
} from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs";
import { type OrganizationMembership } from "@clerk/nextjs/dist/types/server";
import { v4 as uuidv4 } from "uuid";

export const disbursementRequestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        propertyOwnerId: z.number().optional(),
        amount: z.string(),
        description: z.string(),
        distributeTo: z.enum(["property_owner", "forfeit"]),
        status: z.enum(["pending", "approved", "rejected"]),
        propertyOwner: z
          .object({
            name: z.string(),
            phone: z.string(),
            email: z.string().email().optional(),
          })
          .optional(),
        address: z
          .object({
            street: z.string(),
            unit: z.string().optional(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const matchCase = await ctx.db.query.cases.findFirst({
        where: eq(cases.id, input.caseId),
        with: {
          deposits: true,
          disbursementRequests: true,
        },
      });

      const totalDisbursmentsForOwner = matchCase?.disbursementRequests.reduce(
        (total: number, disbursement) => {
          if (disbursement.propertyOwnerId === input.propertyOwnerId) {
            return total + Number(disbursement.amount);
          } else {
            return total;
          }
        },
        0,
      );

      const totalDepositsForOwner = matchCase?.deposits.reduce(
        (total: number, deposit) => {
          if (deposit.propertyOwnerId === input.propertyOwnerId) {
            return total + Number(deposit.amount);
          } else {
            return total;
          }
        },
        0,
      );

      if (totalDisbursmentsForOwner && totalDepositsForOwner) {
        const totalDisbursmentsForOwnerAndRequest =
          totalDisbursmentsForOwner + Number(input.amount);

        if (totalDisbursmentsForOwnerAndRequest > totalDepositsForOwner) {
          throw new Error(
            "The total amount of disbursements for this owner cannot exceed the total amount of deposits",
          );
        }
      }

      let createdRequest = null;
      if (input.propertyOwner) {
        const createdPropertyOwner = await ctx.db
          .insert(propertyOwners)
          .values({
            name: input.propertyOwner.name,
            phone: input.propertyOwner.phone,
            email: input.propertyOwner.email,
            createdBy: ctx.auth.userId,
            orgId: ctx.auth.orgId!,
          });

        if (input.address) {
          await ctx.db.insert(addresses).values({
            street: input.address.street,
            unit: input.address.unit,
            city: input.address.city,
            state: input.address.state,
            zip: input.address.zip,
            ownerId: Number(createdPropertyOwner.insertId),
            createdBy: ctx.auth.userId,
            orgId: ctx.auth.orgId!,
          });
        }

        createdRequest = await ctx.db.insert(disbursementRequests).values({
          caseId: input.caseId,
          propertyOwnerId: Number(createdPropertyOwner.insertId),
          amount: input.amount.toString(),
          description: input.description,
          distributeTo: input.distributeTo,
          status: input.status,
          slug: uuidv4(),
          createdBy: ctx.auth.userId,
          orgId: ctx.auth.orgId!,
        });
      } else if (input.propertyOwnerId) {
        createdRequest = await ctx.db.insert(disbursementRequests).values({
          caseId: input.caseId,
          propertyOwnerId: input.propertyOwnerId,
          amount: input.amount.toString(),
          description: input.description,
          distributeTo: input.distributeTo,
          status: input.status,
          slug: uuidv4(),
          createdBy: ctx.auth.userId,
          orgId: ctx.auth.orgId!,
        });
      } else {
        createdRequest = await ctx.db.insert(disbursementRequests).values({
          caseId: input.caseId,
          amount: input.amount.toString(),
          description: input.description,
          distributeTo: input.distributeTo,
          status: input.status,
          slug: uuidv4(),
          createdBy: ctx.auth.userId,
          orgId: ctx.auth.orgId!,
        });
      }

      if (!createdRequest) {
        throw new Error("Unable to create request");
      }

      return ctx.db.query.disbursementRequests.findFirst({
        where: and(
          eq(disbursementRequests.id, Number(createdRequest.insertId)),
          eq(disbursementRequests.orgId, ctx.auth.orgId!),
        ),
        columns: {
          id: true,
          slug: true,
        },
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
        orderBy: [desc(disbursementRequests.createdAt)],
      });
    }),

  getAllRequests: protectedProcedure.query(async ({ ctx }) => {
    const users = await clerkClient.organizations.getOrganizationMembershipList(
      {
        organizationId: ctx.auth.orgId!,
      },
    );

    const requests = await ctx.db.query.disbursementRequests.findMany({
      where: eq(disbursementRequests.orgId, ctx.auth.orgId!),
      with: {
        propertyOwner: {
          with: {
            addresses: true,
          },
        },
        case: true,
      },
      orderBy: [desc(disbursementRequests.createdAt)],
    });

    const buildName = (user: OrganizationMembership) => {
      if (!user.publicUserData?.firstName && !user.publicUserData?.lastName) {
        return user.publicUserData?.identifier ?? "";
      } else {
        return (
          user.publicUserData.firstName + " " + user.publicUserData.lastName
        );
      }
    };

    const requestsWithUser = requests.map((request) => {
      const user = users.find(
        (user) => user.publicUserData?.userId === request.createdBy,
      );
      return {
        ...request,
        requester: user ? buildName(user) : "",
      };
    });

    return requestsWithUser;
  }),

  updateRequest: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUser(ctx.auth.userId);

      if (
        !user ||
        (user.publicMetadata.role !== "supervisor" &&
          user.publicMetadata.role !== "admin")
      ) {
        throw new Error("You are not authorized to perform this action");
      }
      await ctx.db
        .update(disbursementRequests)
        .set({
          status: input.status,
        })
        .where(eq(disbursementRequests.id, input.id));
    }),

  getUniqueCaseNumbers: protectedProcedure.query(async ({ ctx }) => {
    const caseNumbers = await ctx.db.query.disbursementRequests.findMany({
      where: eq(disbursementRequests.orgId, ctx.auth.orgId!),
      with: {
        case: true,
      },
    });

    const uniqueCaseNumbers = caseNumbers
      .map((request) => request.case.caseNumber)
      .filter((value, index, self) => self.indexOf(value) === index);

    return uniqueCaseNumbers;
  }),

  getPending: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.disbursementRequests.findMany({
      where: and(
        eq(disbursementRequests.orgId, ctx.auth.orgId!),
        eq(disbursementRequests.status, "pending"),
      ),
      with: {
        propertyOwner: true,
        case: true,
      },
      orderBy: [desc(disbursementRequests.createdAt)],
    });
  }),
});
