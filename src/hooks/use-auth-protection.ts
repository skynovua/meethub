"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to handle authenticated actions
 * @returns An object with authentication-related utilities
 */
export function useAuthProtection() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Wraps a function with authentication check
   * @param callback Function to execute if authenticated
   * @returns A function that checks auth before execution
   */
  const withAuth = <T extends (...args: unknown[]) => unknown>(callback: T) => {
    return (...args: Parameters<T>) => {
      if (status === "loading") {
        return; // Still checking authentication
      }

      if (!session) {
        // Save the current URL to return after login
        const returnUrl = encodeURIComponent(window.location.pathname);
        router.push(`/sign-in?callbackUrl=${returnUrl}`);
        return;
      }

      // User is authenticated, execute the callback
      return callback(...args);
    };
  };

  return {
    withAuth,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    session,
  };
}
