"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [user, router]);

  // Return null or a loading indicator while redirecting
  return null;
}
