import { clerkClient } from "@clerk/nextjs";
import { env } from "~/env.mjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const emailRouter = createTRPCRouter({
  sendApprovalRequestEmail: protectedProcedure
    .input(z.object({ text: z.string(), slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const membershipList =
        await clerkClient.organizations.getOrganizationMembershipList({
          organizationId: ctx.auth.orgId!,
        });

      const userIds: string[] = [];
      membershipList.forEach((membership) => {
        userIds.push(membership.publicUserData?.userId ?? "");
      });

      const users = await clerkClient.users.getUserList({
        userId: userIds,
      });

      const emails: string[] = users
        .filter((user) => user.publicMetadata?.role === "admin")
        .map(
          (user) =>
            user.emailAddresses.find(
              (emailAddress) => emailAddress.id === user.primaryEmailAddressId,
            )?.emailAddress ?? "",
        );

      const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await ctx.auth.getToken()}`,
        },
        body: JSON.stringify({
          emails: emails,
          emailProps: {
            slug: input.slug,
          },
        }),
      });

      if (response.ok) {
        return { message: "Email sent!" };
      } else {
        throw new Error("Email failed to send");
      }
    }),
});
