import { eq, sql, and, desc } from "drizzle-orm";
import {
  cases,
  disbursementRequests,
  deposits,
  type DisbursementRequest,
} from "~/server/db/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const caseCount = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(cases)
      .where(eq(cases.orgId, ctx.auth.orgId!));

    const pendingDisbursements =
      await ctx.db.query.disbursementRequests.findMany({
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

    const recentDeposits = await ctx.db.query.deposits.findMany({
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

    const allDeposits = await ctx.db.query.deposits.findMany({
      where: eq(deposits.orgId, ctx.auth.orgId!),
    });

    const approvedDisbursements =
      await ctx.db.query.disbursementRequests.findMany({
        where: and(
          eq(disbursementRequests.orgId, ctx.auth.orgId!),
          eq(disbursementRequests.status, "approved"),
        ),
      });

    const totalPendingDisbursements = pendingDisbursements.reduce(
      (total: number, disbursement: DisbursementRequest) => {
        return total + Number(disbursement.amount);
      },
      0,
    );

    const totalDisbursements = approvedDisbursements.reduce(
      (total: number, disbursement) => {
        return total + Number(disbursement.amount);
      },
      0,
    );

    const totalDeposits = allDeposits.reduce((total: number, deposit) => {
      return total + Number(deposit.amount);
    }, 0);

    const totalBalance = totalDeposits - totalDisbursements;

    return {
      caseCount: caseCount[0]?.count ?? 0,
      balance: totalBalance,
      totalDeposits: totalDeposits,
      disbursementsToDate: totalDisbursements,
      totalPendingDisbursements: totalPendingDisbursements,
      pendingDisbursements: pendingDisbursements,
      recentDeposits: recentDeposits,
    };
  }),
});
