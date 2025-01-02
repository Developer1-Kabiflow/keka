"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const clearCookies = () =>
  new Promise((resolve) => {
    Cookies.remove("userId", { path: "/", domain: window.location.hostname });
    Cookies.remove("userInfo", { path: "/", domain: window.location.hostname });
    Cookies.remove("redirectTo", {
      path: "/",
      domain: window.location.hostname,
    });
    Cookies.remove("isPassBasedAuth", {
      path: "/",
      domain: window.location.hostname,
    });
    Cookies.remove("userInfo", { path: "/", domain: window.location.hostname });
    Cookies.remove("LoggedinUserId", {
      path: "/",
      domain: window.location.hostname,
    });
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "redirectTo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "isPassBasedAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "LoggedinUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    setTimeout(() => {
      console.log("Remaining cookies:", document.cookie);
      resolve();
    }, 100);
  });

const Logout = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      if (isLoggingOut) return;
      setIsLoggingOut(true);

      await clearCookies();

      console.log("Cookies and session cleared");
      console.log("Remaining cookies after clearing:", document.cookie);

      // Redirect after ensuring cleanup
      setTimeout(() => router.replace("/"), 200);
    };

    performLogout();
  }, [router, isLoggingOut]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-6 bg-gray-100 rounded shadow">
        <h1 className="text-2xl font-semibold">Logging out...</h1>
        <p className="mt-4">You are being logged out, please wait...</p>
      </div>
    </div>
  );
};

export default Logout;
