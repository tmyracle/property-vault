import { auth, SignedIn } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import { DisbursementContainer } from "../_components/disbursement-container";

export default async function Disbursements() {
  const { userId } = auth();
  const disbursementRequests =
    await api.disbursementRequest.getAllRequests.query();

  if (!userId) return null;

  return (
    <SignedIn>
      <div className="p-10">
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Disbursements
              </h2>
              <p className="text-muted-foreground">
                Disbursements and request approvals.
              </p>
            </div>
            <div></div>
          </div>
          <DisbursementContainer disbursementRequests={disbursementRequests} />
        </div>
      </div>
    </SignedIn>
  );
}
