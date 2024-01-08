import { SignedIn, SignedOut } from "@clerk/nextjs";
import Dashboard from "~/app/_components/dashboard/dashboard";
import Landing from "~/app/_components/marketing/landing";

export default function Home() {
  return (
    <div>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <Landing />
      </SignedOut>
    </div>
  );
}
