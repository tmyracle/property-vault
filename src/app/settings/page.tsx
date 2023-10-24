import { auth } from "@clerk/nextjs";
import { TeamSettings } from "../_components/team-settings";

export default function Settings() {
  const { userId } = auth();
  //const memberships = await clerkClient.organizations.getOrganizationMembershipList({})

  if (!userId) return null;

  return (
    <div>
      <TeamSettings />
    </div>
  );
}
