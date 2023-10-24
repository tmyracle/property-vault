import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const membershipList =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: input,
      });

    const userIds: string[] = [];
    membershipList.forEach((membership) => {
      userIds.push(membership.publicUserData?.userId ?? "");
    });

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    console.log(users);

    return users;
  }),

  getInvitations: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const invitations =
        await clerkClient.organizations.getOrganizationInvitationList({
          organizationId: input,
        });
      return invitations;
    }),

  updateUserRole: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const params = {
        publicMetadata: {
          role: input.role,
        },
      };
      await clerkClient.users.updateUser(input.userId, params);
    }),
});
