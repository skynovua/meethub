"use client";

import { useCallback, useEffect } from "react";

import {
  CalendarIcon,
  HomeIcon,
  LogOutIcon,
  Menu,
  PenIcon,
  Presentation,
  User,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const { data: clientSession, update } = useSession();
  const pathname = usePathname();

  const userInitials = clientSession?.user?.name
    ? clientSession.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";

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
    <nav className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-x-2">
          <Presentation size={24} className="text-primary" />
          <span className="text-xl font-bold">MeetHub</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Navigation Dropdown - Always visible */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="data-[state=open]:bg-accent">
                <Menu />
                <span className="sr-only">Navigation</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex w-full cursor-pointer items-center">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>Home</span>
                    {pathname === "/" && <span className="text-primary ml-auto text-xs">•</span>}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/events" className="flex w-full cursor-pointer items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Events</span>
                    {pathname === "/events" && (
                      <span className="text-primary ml-auto text-xs">•</span>
                    )}
                  </Link>
                </DropdownMenuItem>
                {session && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/events/edit/new"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <PenIcon className="mr-2 h-4 w-4" />
                      <span>Create Event</span>
                      {pathname === "/events/edit/new" && (
                        <span className="text-primary ml-auto text-xs">•</span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <div className="px-2 py-2">
                <ThemeSwitcher />
              </div>

              {/* Sign In button for non-logged in users in the dropdown */}
              {!session && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/sign-in"
                      className="text-primary flex w-full cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu - Only visible when logged in */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="data-[state=open]:bg-accent ml-1 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={clientSession?.user?.image || ""} />
                    <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">{clientSession?.user?.name}</p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {clientSession?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="default">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
