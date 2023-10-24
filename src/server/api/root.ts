import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { caseRouter } from "./routers/case";
import { depositRouter } from "./routers/deposit";
import { disbursementRequestRouter } from "./routers/disbursement-request";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  case: caseRouter,
  deposit: depositRouter,
  disbursementRequest: disbursementRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
