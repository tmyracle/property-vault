import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";
import cn from "classnames";

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/app/_components/nav/navbar";
import { Toaster } from "~/app/_components/ui/toaster";
import { SignedIn } from "@clerk/nextjs";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "PropertyVault",
  description: "Property room management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider headers={headers()}>
          <ClerkProvider>
            <main className="min-h-screen w-full">
              <Navbar />
              <SignedIn>
                <div className="mt-14"></div>
              </SignedIn>
              {children}
            </main>
            <Toaster />
          </ClerkProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
