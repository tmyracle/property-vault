import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mt-36 flex h-[100vh] w-full justify-center">
      <SignIn />
    </div>
  );
}
