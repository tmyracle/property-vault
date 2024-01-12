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
        .filter((user) =>
          ["admin", "supervisor"].includes(user.publicMetadata?.role as string),
        )
        .map(
          (user) =>
            user.emailAddresses.find(
              (emailAddress) => emailAddress.id === user.primaryEmailAddressId,
            )?.emailAddress ?? "",
        );

      console.log(
        "Attempting to send email to endpoint:",
        `${env.DOMAIN}/api/send`,
      );

      const response = await fetch(`${env.DOMAIN}/api/send`, {
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

  sendRequestReviewedEmail: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        status: z.string(),
        caseNumber: z.string(),
        requester: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const requester = await clerkClient.users.getUser(input.requester);
      const email =
        requester?.emailAddresses.find(
          (emailAddress) => emailAddress.id === requester.primaryEmailAddressId,
        )?.emailAddress ?? "";

      const response = await fetch(`${env.DOMAIN}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await ctx.auth.getToken()}`,
        },
        body: JSON.stringify({
          emails: [email],
          emailProps: {
            slug: input.slug,
            status: input.status,
            caseNumber: input.caseNumber,
          },
          templateType: "disbursementRequestReviewed",
        }),
      });

      if (response.ok) {
        return { message: "Email sent!" };
      } else {
        throw new Error("Email failed to send");
      }
    }),
});
