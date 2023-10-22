import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { SignedIn, auth } from "@clerk/nextjs";
import { taskSchema } from "../_components/data/schema";
import { CaseList } from "../_components/case-list";
import { CreateCase } from "../_components/create-case";
import { Navbar } from "../_components/navbar";
import { DataTable } from "../_components/data-table";
import { columns } from "../_components/columns";
import { type Task } from "../_components/data/schema";
import { api } from "~/trpc/server";
import { type Case } from "~/server/db/schema";
import { Button } from "../_components/ui/button";

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
                Here&apos;s a list of your cases!
              </p>
            </div>
            <div>
              <Button>Add Case</Button>
            </div>
          </div>
          <DataTable data={cases} columns={columns} />
        </div>
      </div>
    </SignedIn>
  );
}
