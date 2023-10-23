import { auth } from "@clerk/nextjs";

export default function Disbursements() {
  const { userId } = auth();

  if (!userId) return null;

  return <div className="p-10">This is where the disbursements live</div>;
}
