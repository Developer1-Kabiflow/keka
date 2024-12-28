import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("LoggedinUserId"); // Getting cookie from the request
  // const hiddenPages = ["", "/employee/logout", "/callback"];

  // // Skip middleware for paths in hiddenPages
  // if (hiddenPages.includes(url.pathname)) {
  //   console.log("Skipping middleware for hidden page:", url.pathname);
  //   return NextResponse.next();
  // }
  const isIncludePath =
    url.search.includes("requestId") || url.search.includes("FormId");

  if (!isIncludePath) {
    console.log("Skipping middleware for:", url.pathname);
    return NextResponse.next(); // Skip middleware for these paths
  }

  console.log("Middleware triggered for:", url.pathname);

  // If no authToken, redirect to login page
  if (!authToken) {
    url.pathname = "/"; // Set the pathname to the login page

    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
    console.log("Redirecting to login. Redirect URL:", redirectTo);

    // Setting a cookie to store the original URL
    const response = NextResponse.redirect(url);
    response.cookies.set("redirectTo", redirectTo, {
      path: "/", // Make sure it's accessible across your app
      sameSite: "Strict", // Helps to avoid cross-site request issues
    });

    console.log("Cookie 'redirectTo' set with value:", redirectTo);
    console.log("Redirecting to login from middleware:", url.toString());

    return response; // Return the response with the redirect
  }

  // Proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"], // Middleware applies only to /employee paths
};
