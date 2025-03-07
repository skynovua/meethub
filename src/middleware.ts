import NextAuth from "next-auth";

import authConfig from "@/core/auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, privateRoutes } from "@/core/routes";

const { auth } = NextAuth(authConfig);

// Helper function to check if a path matches a route pattern with parameters
const matchesRoute = (path: string, routePattern: string): boolean => {
  // Exact match
  if (routePattern === path) return true;

  // Check if route has dynamic segments like [id]
  if (routePattern.includes("[") && routePattern.includes("]")) {
    const routeParts = routePattern.split("/");
    const pathParts = path.split("/");

    // Different segment length means no match
    if (routeParts.length !== pathParts.length) return false;

    // Check each segment
    return routeParts.every((routePart, i) => {
      const pathPart = pathParts[i];
      return routePart.startsWith("[") && routePart.endsWith("]") ? true : routePart === pathPart;
    });
  }

  return false;
};

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.some((route) => matchesRoute(pathname, route));
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
