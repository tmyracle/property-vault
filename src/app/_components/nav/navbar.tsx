import { OrganizationSwitcher, SignedIn } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link href="/">
              <div className="mr-6 flex items-center hover:cursor-pointer hover:underline">
                <Image
                  src="/propertyroom.png"
                  width={48}
                  height={48}
                  alt="company logo"
                />
                <div className="ml-2 text-lg font-semibold">PropertyVault</div>
              </div>
            </Link>
            <SignedIn>
              <MainNav className="mx-6" />
            </SignedIn>
            <div className="ml-auto flex items-center space-x-4">
              <SignedIn>
                <OrganizationSwitcher hidePersonal={true} />
                <UserNav />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
