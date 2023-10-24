import { auth, UserProfile } from "@clerk/nextjs";

export default function Account() {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <div>
      <UserProfile />
    </div>
  );
}
