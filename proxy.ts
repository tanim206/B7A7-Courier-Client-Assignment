import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER";

const AUTH_ROUTES = ["/login", "/create-account", "/forgot-password"];

const DASHBOARD_PREFIX = "/dashboard";
const ADMIN_PREFIX = "/dashboard/admin";
const STAFF_PREFIX = "/dashboard/staff";

/**
 * Check whether a value is a valid user role.
 */
function isUserRole(value: unknown): value is UserRole {
  return (
    value === "SUPER_ADMIN" ||
    value === "ADMIN" ||
    value === "STAFF" ||
    value === "CUSTOMER"
  );
}

/**
 * Safely read the role from JWT payload.
 *
 * NOTE:
 * This only decodes the JWT.
 * It does NOT verify the JWT signature.
 * Real authentication and authorization must be
 * handled by the backend.
 */
function getRoleFromToken(token: string | undefined): UserRole | null {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    // JWT must contain header.payload.signature
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];

    if (!payload) {
      return null;
    }

    // Base64URL -> Base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add missing Base64 padding
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Reject characters outside the Base64 alphabet instead of
    // silently decoding garbage.
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(paddedBase64)) {
      return null;
    }

    // Edge-safe decode: atob exists in Edge + Node 16+,
    // fall back to Buffer only where atob is unavailable.
    let decodedPayload: string;
    if (typeof atob === "function") {
      const binary = atob(paddedBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      decodedPayload = new TextDecoder().decode(bytes);
    } else if (
      typeof globalThis.Buffer !== "undefined" &&
      typeof globalThis.Buffer.from === "function"
    ) {
      decodedPayload = globalThis.Buffer.from(paddedBase64, "base64").toString(
        "utf-8",
      );
    } else {
      return null;
    }

    const parsed: unknown = JSON.parse(decodedPayload);

    // Payload must be a plain object, not an array / string / null.
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    const payloadData = parsed as {
      role?: unknown;
      exp?: unknown;
    };

    /**
     * Check JWT expiration if exp exists.
     */
    if (
      typeof payloadData.exp === "number" &&
      payloadData.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    /**
     * Validate role.
     */
    if (!isUserRole(payloadData.role)) {
      return null;
    }

    return payloadData.role;
  } catch {
    return null;
  }
}

/**
 * Get dashboard home according to user role.
 */
function dashboardHomeByRole(role: UserRole | null): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/dashboard/admin";

    case "STAFF":
      return "/dashboard/staff";

    case "CUSTOMER":
    default:
      return "/dashboard";
  }
}

/**
 * Check auth-related routes.
 */
function isAuthRoute(pathname: string): boolean {
  return (
    AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    ) || pathname.startsWith("/create-account/verify")
  );
}

/**
 * Check dashboard route.
 */
function isDashboardRoute(pathname: string): boolean {
  return (
    pathname === DASHBOARD_PREFIX || pathname.startsWith(`${DASHBOARD_PREFIX}/`)
  );
}

/**
 * Check admin route.
 */
function isAdminRoute(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

/**
 * Check staff route.
 */
function isStaffRoute(pathname: string): boolean {
  return pathname === STAFF_PREFIX || pathname.startsWith(`${STAFF_PREFIX}/`);
}

/**
 * Redirect user to their role-based dashboard.
 */
function redirectToDashboard(request: NextRequest, role: UserRole | null) {
  return NextResponse.redirect(new URL(dashboardHomeByRole(role), request.url));
}

/**
 * Redirect unauthenticated user to home page.
 * Login na thakle /dashboard, /dashboard/admin
 * sob dashboard route -> "/" (home) a redirect hobe.
 */
function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

/**
 * Main Proxy
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * --------------------------------------------------
   * AUTH TOKENS
   * --------------------------------------------------
   */

  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const hasAccessToken = Boolean(accessToken);
  const hasRefreshToken = Boolean(refreshToken);

  const isAuthenticated = hasAccessToken || hasRefreshToken;

  /*
   * --------------------------------------------------
   * USER ROLE
   * --------------------------------------------------
   */

  const role = getRoleFromToken(accessToken);

  /*
   * --------------------------------------------------
   * ROOT ROUTE
   * --------------------------------------------------
   *
   * /
   *
   * Not logged in
   *     -> /login
   *
   * CUSTOMER
   *     -> /dashboard
   *
   * STAFF
   *     -> /dashboard/staff
   *
   * ADMIN
   *     -> /dashboard/admin
   *
   * SUPER_ADMIN
   *     -> /dashboard/admin
   */

  if (pathname === "/") {
    if (isAuthenticated) {
      return redirectToDashboard(request, role);
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  /*
   * --------------------------------------------------
   * AUTH ROUTES
   * --------------------------------------------------
   *
   * /login
   * /create-account
   * /forgot-password
   *
   * Logged-in users should not access these pages.
   */

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return redirectToDashboard(request, role);
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * NON-DASHBOARD ROUTES
   * --------------------------------------------------
   *
   * Everything outside dashboard is allowed.
   */

  if (!isDashboardRoute(pathname)) {
    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * DASHBOARD AUTH CHECK
   * --------------------------------------------------
   *
   * No access token and no refresh token
   * => user is not logged in.
   */

  if (!isAuthenticated) {
    return redirectToLogin(request);
  }

  /*
   * --------------------------------------------------
   * UNKNOWN ROLE
   * --------------------------------------------------
   *
   * Possible reasons:
   *
   * - access token expired
   * - malformed token
   * - role missing
   * - only refresh token exists
   *
   * Don't redirect immediately.
   * Let the client/backend refresh the token.
   */

  if (!role) {
    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * /dashboard
   * --------------------------------------------------
   *
   * ADMIN / SUPER_ADMIN
   *     -> /dashboard/admin
   *
   * STAFF
   *     -> /dashboard/staff
   *
   * CUSTOMER
   *     -> /dashboard
   */

  if (pathname === DASHBOARD_PREFIX) {
    const dashboardHome = dashboardHomeByRole(role);

    if (dashboardHome !== DASHBOARD_PREFIX) {
      return NextResponse.redirect(new URL(dashboardHome, request.url));
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * ADMIN ROUTES
   * --------------------------------------------------
   *
   * /dashboard/admin/*
   *
   * Allowed:
   * - ADMIN
   * - SUPER_ADMIN
   */

  if (isAdminRoute(pathname)) {
    const canAccessAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    if (!canAccessAdmin) {
      return redirectToDashboard(request, role);
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * STAFF ROUTES
   * --------------------------------------------------
   *
   * /dashboard/staff/*
   *
   * Allowed:
   * - STAFF
   * - ADMIN
   * - SUPER_ADMIN
   */

  if (isStaffRoute(pathname)) {
    const canAccessStaff =
      role === "STAFF" || role === "ADMIN" || role === "SUPER_ADMIN";

    if (!canAccessStaff) {
      return redirectToDashboard(request, role);
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * OTHER DASHBOARD ROUTES
   * --------------------------------------------------
   *
   * Examples:
   *
   * /dashboard/profile
   * /dashboard/settings
   * /dashboard/orders
   *
   * These routes are allowed here.
   *
   * Fine-grained authorization should be handled
   * by RoleGuard and backend authorization.
   */

  return NextResponse.next();
}

/**
 * Proxy Matcher
 */
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/create-account",
    "/create-account/:path*",
    "/forgot-password",
    "/forgot-password/:path*",
  ],
};
