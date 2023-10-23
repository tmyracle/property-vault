import { SignedIn, auth } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import { DataTable } from "../_components/data-table";
import { columns } from "../_components/columns";
import { AddCaseDialog } from "../_components/add-case-dialog";

export default async function Page() {
  const { userId } = auth();
  const cases = await api.case.getAllCases.query();

  if (!userId || !cases) return null;

  return (
    <SignedIn>
      <div className="p-10">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Cases</h2>
              <p className="text-muted-foreground">
                List of cases with property being tracked.
              </p>
            </div>
            <div>
              <AddCaseDialog />
            </div>
          </div>
          <DataTable data={cases} columns={columns} />
        </div>
      </div>
    </SignedIn>
  );
}
