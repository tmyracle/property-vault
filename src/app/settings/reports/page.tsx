import { auth } from "@clerk/nextjs";

export default function Notifications() {
  const { userId } = auth();

  if (!userId) return null;

  return <div>This is where the report preferences live.</div>;
}
