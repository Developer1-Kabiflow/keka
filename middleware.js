import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const authToken = req.cookies.get("userId");

  const isIncludePath =
    url.search.includes("requestId") || url.search.includes("formTemplateId");
  if (!isIncludePath) {
    console.log("skipping middleware:", url.pathname);
    return NextResponse.next();
  }

  console.log("Middleware triggered for:", url.pathname);

  if (!authToken) {
    url.pathname = "/"; // Redirect to login page
    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
    Cookies.set("redirectTo", JSON.stringify(redirectTo), {
      expires: 1,
      path: "/",
      secure: true,
      sameSite: "Strict",
    });
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
