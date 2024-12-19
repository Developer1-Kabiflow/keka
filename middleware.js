import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId"); // Getting cookie from the request

  // Check if the URL contains either requestId or formTemplateId in the query string
  const isIncludePath =
    url.search.includes("requestId") || url.search.includes("formTemplateId");

  if (!isIncludePath) {
    console.log("skipping middleware:", url.pathname);
    return NextResponse.next(); // Skip middleware for these paths
  }

  console.log("Middleware triggered for:", url.pathname);

  // If no authToken, redirect to login page
  if (!authToken) {
    url.pathname = "/"; // Redirect to the login page
    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;

    // Setting a cookie to store the redirect URL
    const response = NextResponse.redirect(url);
    response.cookies.set("redirectTo", redirectTo, {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    console.log("redirectTo-->" + redirectTo);
    console.log("Redirecting to login from middleware:", url.toString());

    return response; // Return the response with the redirect
  }

  // Proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"], // Middleware applies only to /employee paths
};
