import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "../contexts/AuthContext";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MeetApp",
  description: "Organize and manage your meetups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">{children}</div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

