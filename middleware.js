import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId"); // Adjust cookie key to match your app
  const exemptPaths = ["/callback", "/login", "/logout"];

  console.log("Middleware triggered for:", url.pathname);

  // Exempt paths for login, logout, or callback
  if (exemptPaths.some((path) => url.pathname.includes(path))) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!authToken) {
    // Add original URL for redirection after login
    url.pathname = "/"; // Redirect to login page
    url.searchParams.set(
      "redirectTo",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }

  // Allow request to proceed if authenticated
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/employee/:path*"], // Middleware runs for all routes under /employee
};
