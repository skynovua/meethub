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
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const { data: clientSession, update } = useSession();
  const isMobile = useIsMobile();
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

  // Render common navigation items for desktop
  const renderDesktopMenu = () => (
    <>
      <Button variant="outline" asChild>
        <Link href="/edit/new">Create Meetup</Link>
      </Button>
      {/* <Button variant="outline" asChild>
        <Link href="/">{user?.name}</Link>
      </Button> */}
      <Button variant="outline" onClick={onLogout} disabled={!clientSession?.user}>
        Logout
      </Button>
    </>
  );

  // Render mobile dropdown menu
  const renderMobileMenu = () => (
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
        {/* <DropdownMenuItem asChild>
          <Link href="/profile">
            <User />
            <span>{user?.name}</span>
          </Link>
        </DropdownMenuItem> */}
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
  );

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-x-2">
          <Presentation size={24} />
          <span className="font-bold">MeetHub</span>
        </Link>
        <div className="flex items-center space-x-2">
          {user && (isMobile ? renderMobileMenu() : renderDesktopMenu())}
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
