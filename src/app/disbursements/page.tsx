import { Navbar } from "../_components/navbar";
import { auth } from "@clerk/nextjs";

export default function Disbursements() {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <div className="p-10">This is where the disbursements live</div>
    </main>
  );
}
