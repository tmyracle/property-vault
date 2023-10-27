import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { caseRouter } from "./routers/case";
import { depositRouter } from "./routers/deposit";
import { disbursementRequestRouter } from "./routers/disbursement-request";
import { userRouter } from "./routers/user";
import { dashboardRouter } from "./routers/dashboard";
import { emailRouter } from "./routers/email";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  case: caseRouter,
  deposit: depositRouter,
  disbursementRequest: disbursementRequestRouter,
  dashboard: dashboardRouter,
  email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
