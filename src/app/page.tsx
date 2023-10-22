import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SignedIn>
        <div className="container flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            This is the dashboard page
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div>
          <Link href="/sign-in">Sign in</Link>
        </div>
      </SignedOut>
    </>
  );
}
