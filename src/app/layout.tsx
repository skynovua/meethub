import type React from "react";

import { Inter } from "next/font/google";

import Navbar from "@/components/navbar";
import AuthProvider from "@/providers/auth-provider";
import ThemeProvider from "@/providers/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MeetApp",
  description: "Organize and manage your meetups",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="bg-background text-foreground min-h-screen">
              <Navbar />
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
