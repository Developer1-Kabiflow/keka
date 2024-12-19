import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId");

  const exemptPaths = ["/callback", "/login", "/logout"];
  console.log("Middleware triggered for:", url.pathname);

  // Skip middleware for exempt paths
  if (exemptPaths.some((path) => url.pathname.includes(path))) {
    return NextResponse.next();
  }

  // Redirect if no authToken
  if (!authToken) {
    url.pathname = "/"; // Redirect to login page
    url.searchParams.set(
      "redirectTo",
      req.nextUrl.pathname + req.nextUrl.search
    );
    console.log("Redirecting to login from middleware:", url.toString());
    return NextResponse.redirect(url);
  }

  // Proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"], // Middleware will not apply to /logout
};
