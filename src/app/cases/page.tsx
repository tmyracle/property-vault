import { SignedIn, auth } from "@clerk/nextjs";
import { CaseList } from "../_components/case-list";
import { CreateCase } from "../_components/create-case";
import { Navbar } from "../_components/navbar";

export default function Page() {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <SignedIn>
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="p-10">
          <div className="max-w-md space-y-2">
            <div className="text-md font-semibold">Create new case</div>
            <CreateCase />
            <CaseList />
          </div>
        </div>
      </main>
    </SignedIn>
  );
}
