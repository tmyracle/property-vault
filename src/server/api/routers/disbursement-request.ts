//import { eq } from "drizzle-orm";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { disbursementRequests, cases } from "~/server/db/schema";
import { clerkClient } from "@clerk/nextjs";
import { type OrganizationMembership } from "@clerk/nextjs/dist/types/server";
const { v4: uuidv4 } = require("uuid");

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

      await ctx.db.insert(disbursementRequests).values({
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
});
