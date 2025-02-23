"use client";

import { useCallback, useEffect } from "react";

import { LogOutIcon, MoreHorizontal, PenIcon, Presentation, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const { data: clientSession, update } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (session && !clientSession) {
      update();
    }
  }, [session, clientSession, update]);

  const onLogout = useCallback(() => {
    logout();
    signOut();
  }, []);

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-x-2">
          <Presentation size={24} />
          <span className="font-bold">MeetHub</span>
        </Link>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="data-[state=open]:bg-accent">
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/edit/new">
                  <PenIcon />
                  <span>Create Meetup</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User />
                  <span>{user?.name}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 hover:!bg-red-100 hover:!text-red-600"
              >
                <LogOutIcon />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
