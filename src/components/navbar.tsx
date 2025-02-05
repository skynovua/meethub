"use client";

import { Presentation } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-x-2">
          <Presentation size={24} />
          <span className="font-bold">MeetHub</span>
        </Link>
        <div className="flex items-center space-x-2">
          {session?.user && (
            <>
              <Button variant="outline" asChild>
                <Link href="/profile">{session.user.name}</Link>
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
