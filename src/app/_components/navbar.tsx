import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export function Navbar() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <SignedIn>
              <MainNav className="mx-6" />
            </SignedIn>
            <div className="ml-auto flex items-center space-x-4">
              <SignedIn>
                <OrganizationSwitcher />
                <UserNav />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
