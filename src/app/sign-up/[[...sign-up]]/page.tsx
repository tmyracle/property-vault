import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-[100vh] w-full justify-center pt-36">
      <SignUp />
    </div>
  );
}
