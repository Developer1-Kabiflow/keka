import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId");

  const isIncludePath =
    url.pathname.includes("requestId") ||
    url.pathname.includes("formTemplateId");
  if (!isIncludePath) {
    console.log("skipping middleware:", url.pathname);
    return NextResponse.next();
  }

  console.log("Middleware triggered for:", url.pathname);

  if (!authToken) {
    url.pathname = "/"; // Redirect to login page
    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
    sessionStorage.setItem("redirectTo", redirectTo);
    console.log("redirectTo-->" + redirectTo);
    console.log("Redirecting to login from middleware:", url.toString());
    return NextResponse.redirect(url);
  }

  // Proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"], // Middleware applies only to /employee paths
};
