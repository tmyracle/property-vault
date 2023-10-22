import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mt-36 flex h-[100vh] w-[100vw] justify-center">
      <SignUp />
    </div>
  );
}
