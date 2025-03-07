import type React from "react";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/core/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetHub | Discover and Join Exciting Events",
  description:
    "Find and join events that match your interests, connect with like-minded people, and create unforgettable experiences with MeetHub.",
  keywords: ["events", "meetups", "social events", "networking", "community events"],
  openGraph: {
    title: "MeetHub | Discover and Join Exciting Events",
    description:
      "Find and join events that match your interests, connect with like-minded people, and create unforgettable experiences.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "MeetHub",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};
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
