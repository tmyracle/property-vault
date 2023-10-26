import { auth, SignedIn } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import { DepositsContainer } from "~/app/_components/deposits/deposits-container";

export default async function Deposits() {
  const { userId } = auth();
  const deposits = await api.deposit.getAllDeposits.query();

  if (!userId) return null;

  return (
    <SignedIn>
      <div className="p-10">
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Deposits</h2>
              <p className="text-muted-foreground">All deposited property</p>
            </div>
            <div></div>
          </div>
          <DepositsContainer deposits={deposits} />
        </div>
      </div>
    </SignedIn>
  );
}
