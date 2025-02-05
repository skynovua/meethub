import type React from "react";

import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/core/auth";
import ThemeProvider from "@/providers/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MeetApp",
  description: "Organize and manage your meetups",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="bg-background text-foreground min-h-screen">
              <Navbar />
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
