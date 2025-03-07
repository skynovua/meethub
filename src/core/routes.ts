/**
 * An array of routes that require authentication
 * Users must be logged in to access these routes
 * @type {string[]}
 */
export const privateRoutes = ["/profile", "/events/edit/new", "/events/edit/[id]"];

/**
 * An array of authentication-related route paths.
 *
 * This array contains the paths for login and registration routes
 * used in the authentication module of the application.
 *
 * @constant {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/**
 * The prefix for all authentication-related API routes.
 * This constant is used to ensure that all authentication endpoints
 * are grouped under a common path prefix.
 *
 * @constant {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default path to which users are redirected after a successful login.
 *
 * @constant {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
