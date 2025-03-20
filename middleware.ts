import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

// Function to get the current locale from a path
function getLocaleFromPath(path) {
  const segments = path.split("/").filter(Boolean);
  return segments[0] && routing.locales.includes(segments[0])
    ? segments[0]
    : routing.defaultLocale;
}

// Function to create localized URLs
function createLocalizedUrl(path, locale, origin) {
  // Make sure path starts with a slash but doesn't have locale prefix already
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Add locale prefix if path doesn't already have it
  if (!path.startsWith(`/${locale}/`)) {
    path = `/${locale}${path}`;
  }

  return new URL(path, origin);
}

// Function to remove locale from path for comparison
function removeLocaleFromPath(path) {
  const segments = path.split("/");
  if (segments.length > 1 && routing.locales.includes(segments[1])) {
    // Remove the locale segment and join the path back
    return "/" + segments.slice(2).join("/");
  }
  return path;
}

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const secret = process.env.NEXTAUTH_SECRET;

  // Get locale from the current path
  const locale = getLocaleFromPath(pathname);

  // Get path without locale for route matching
  const pathWithoutLocale = removeLocaleFromPath(pathname);

  // Check if this is an API route
  const isApiRoute = pathname.startsWith("/api");
  const isAuthApiRoute = pathname.startsWith(apiAuthPrefix);

  if (isApiRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  const response = intlMiddleware(req);

  // Continue with auth logic
  const token = await getToken({
    req,
    secret,
    salt:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const isLoggedIn = !!token;

  // Check routes without locale prefix for better matching
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(route)
  );
  const isErrorRoute = pathWithoutLocale.includes("error");
  const isTravelAgentRoute = pathWithoutLocale.startsWith("/travel-agent");

  // Handle API, public and error routes
  if (isAuthApiRoute || isPublicRoute || isErrorRoute) {
    return response;
  }

  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Prevent redirect loop - check if we're already at the target
      if (token.role === "TravelAgent") {
        const targetPath = `/travel-agent/apply-now`;
        if (!pathWithoutLocale.startsWith(targetPath)) {
          const redirectUrl = createLocalizedUrl(
            targetPath,
            locale,
            nextUrl.origin
          );
          return NextResponse.redirect(redirectUrl);
        }
      } else {
        const targetPath = DEFAULT_LOGIN_REDIRECT;
        if (pathWithoutLocale !== targetPath) {
          const redirectUrl = createLocalizedUrl(
            targetPath,
            locale,
            nextUrl.origin
          );
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
    return response;
  }

  // Handle role-based routing
  if (token) {
    if (isTravelAgentRoute) {
      // Only allow travel agents to access travel-agent routes
      if (token.role === "TravelAgent") {
        return response;
      }

      // Redirect others to dashboard - prevent redirect loop
      const targetPath = DEFAULT_LOGIN_REDIRECT;
      if (pathWithoutLocale !== targetPath) {
        const redirectUrl = createLocalizedUrl(
          targetPath,
          locale,
          nextUrl.origin
        );
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Non travel-agent paths - handle travel agents
    if (!isTravelAgentRoute) {
      if (token.role === "TravelAgent") {
        // Redirect travel agents to their dashboard - prevent redirect loop
        const targetPath = "/travel-agent/visa-letter";
        if (!pathWithoutLocale.startsWith(targetPath)) {
          const redirectUrl = createLocalizedUrl(
            targetPath,
            locale,
            nextUrl.origin
          );
          return NextResponse.redirect(redirectUrl);
        }
        return response;
      }
    }
  }

  // Protected routes - redirect to login if not authenticated
  if (!isLoggedIn) {
    // Prevent redirect loop - check if we're already at the login page
    const loginPath = "/home";
    if (!pathWithoutLocale.startsWith(loginPath)) {
      const loginUrl = createLocalizedUrl(loginPath, locale, nextUrl.origin);

      // Preserve the original URL as returnUrl
      loginUrl.searchParams.set("returnUrl", nextUrl.pathname);

      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
