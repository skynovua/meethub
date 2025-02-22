import type React from "react";

import { Inter } from "next/font/google";

import Navbar from "@/components/navbar";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/core/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "MeetApp", description: "Organize and manage your meetups" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="bg-background text-foreground min-h-screen">
              <Navbar session={session} />

              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
