import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // ✅ Public routes (NO LOGIN REQUIRED)
  const publicRoutes = [
    "/",
    "/search",

    "/singlepage",
    "/auth/login",
    "/auth/customer/signup",
    "/auth/broker/signup",
    "/auth/owner/signup",
  ];

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublic) return NextResponse.next();

  // ❌ If not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // const role = token.role;
  const role = token?.role || token?.user?.role;

  // ✅ Role-based route protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (
    pathname.startsWith("/listing") &&
    !["BROKER", "ADMIN", "OWNER"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/broker") && !["BROKER"].includes(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    pathname.startsWith("/dashboard/customer") &&
    !["CUSTOMER"].includes(role)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/owner") && !["OWNER"].includes(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/listing/:path*"],
};
