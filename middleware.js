import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId"); // Adjust cookie key to match your app

  // If the user is not logged in, redirect to login with the current URL as a query param
  if (!authToken) {
    url.pathname = "/login";
    url.searchParams.set(
      "redirectTo",
      req.nextUrl.pathname + req.nextUrl.search
    ); // Preserve original URL
    return NextResponse.redirect(url);
  }

  // If logged in, allow the request to proceed
  return NextResponse.next();
}

// Define the paths where this middleware should apply
export const config = {
  matcher: ["/employee/:path*"], // Middleware will run for all routes under /employee
};