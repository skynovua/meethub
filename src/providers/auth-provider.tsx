"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

interface AuthProviderProps {
  session?: SessionProviderProps["session"];
  children: React.ReactNode;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
