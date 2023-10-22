import { OrganizationSwitcher } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export function Navbar() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <OrganizationSwitcher />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
