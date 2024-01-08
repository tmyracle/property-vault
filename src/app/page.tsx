import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Dashboard from "~/app/_components/dashboard/dashboard";

export default function Home() {
  return (
    <div>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <div className="mt-36 flex justify-center">
          <Link href="/sign-in">Sign in</Link>
        </div>
      </SignedOut>
    </div>
  );
}
