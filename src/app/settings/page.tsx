import { auth } from "@clerk/nextjs";
import { TeamSettings } from "~/app/_components/settings/team-settings";

export default function Settings() {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <div>
      <TeamSettings />
    </div>
  );
}
