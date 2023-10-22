import { api } from "~/trpc/server";
import { Navbar } from "./_components/navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <>
      <SignedIn>
        <main className="min-h-screen w-full">
          <Navbar />
          <div className="container flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                {hello ? hello.greeting : "Loading tRPC query..."}
              </p>
            </div>
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <div>
          <Link href="/">Sign in</Link>
        </div>
      </SignedOut>
    </>
  );
}
