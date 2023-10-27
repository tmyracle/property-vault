import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

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

      const response = await fetch("http://localhost:3000/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await ctx.auth.getToken()}`,
        },
        body: JSON.stringify({
          emails: emails,
          slug: input.slug,
        }),
      });

      if (response.ok) {
        return { message: "Email sent!" };
      } else {
        throw new Error("Email failed to send");
      }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
