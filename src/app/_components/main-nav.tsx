"use client";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

const navigation = [
  { name: "Dashboard", link: "/" },
  { name: "Cases", link: "/cases" },
  { name: "Disbursements", link: "/disbursements" },
  { name: "Settings", link: "/settings" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <SignedIn>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={`text-sm font-medium ${
              pathname === item.link ? "" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            {item.name}
          </Link>
        ))}
      </SignedIn>
    </nav>
  );
}
