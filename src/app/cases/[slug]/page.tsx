import { SignedIn, auth } from "@clerk/nextjs";
import { AddDepositDialog } from "~/app/_components/add-deposit-dialog";
import { DepositList } from "~/app/_components/deposit-list";
import { DisbursementList } from "~/app/_components/disbursement-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { slug: string } }) {
  const { userId } = auth();
  const caseForPage = await api.case.getCase.query(params.slug);

  if (!userId || !caseForPage) return null;

  function calculatedTotalDeposits() {
    let total = 0;
    if (!caseForPage) return 0;
    caseForPage.deposits.forEach((deposit) => {
      total += Number(deposit.amount);
    });
    return total;
  }

  function calculatedTotalDisbursements() {
    let total = 0;
    if (!caseForPage) return 0;
    caseForPage.disbursementRequests.forEach((disbursementRequest) => {
      if (disbursementRequest.status === "approved") {
        total += Number(disbursementRequest.amount);
      }
    });
    return total;
  }

  function calculatedPendingDisbursements() {
    let total = 0;
    if (!caseForPage) return 0;
    caseForPage.disbursementRequests.forEach((disbursementRequest) => {
      if (disbursementRequest.status === "pending") {
        total += Number(disbursementRequest.amount);
      }
    });
    return total;
  }

  function calculatedCurrentBalance() {
    let total = 0;
    if (!caseForPage) return 0;
    caseForPage.deposits.forEach((deposit) => {
      total += Number(deposit.amount);
    });
    caseForPage.disbursementRequests.forEach((disbursementRequest) => {
      if (disbursementRequest.status === "approved") {
        total -= Number(disbursementRequest.amount);
      }
    });
    return total;
  }

  return (
    <SignedIn>
      <div className="p-10">
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <div className="flex items-start justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Case # {caseForPage.caseNumber}
              </h2>
              <p className="text-sm text-muted-foreground">
                {caseForPage.name}
              </p>
              {caseForPage.description && (
                <p className="text-sm text-muted-foreground">
                  {caseForPage.description}
                </p>
              )}
            </div>
            <div className="space-x-4">
              <AddDepositDialog caseId={caseForPage.id} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(calculatedCurrentBalance())}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Deposits
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(calculatedTotalDeposits())}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Disbursements To Date
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(calculatedTotalDisbursements())}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Disbursements
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(calculatedPendingDisbursements())}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Property</CardTitle>
                <CardDescription>
                  Property associated with this case.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepositList deposits={caseForPage.deposits} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Disbursement Requests</CardTitle>
                <CardDescription>
                  Requests for property disbursements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisbursementList
                  disbursementRequests={caseForPage.disbursementRequests}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
