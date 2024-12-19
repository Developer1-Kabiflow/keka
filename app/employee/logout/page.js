"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const clearCookies = () =>
  new Promise((resolve) => {
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userInfo", { path: "/" });
    Cookies.remove("isPassBasedAuth", { path: "/" });

    setTimeout(() => {
      console.log("Remaining cookies:", document.cookie);
      resolve();
    }, 100); // Small delay to ensure cookies are cleared
  });

const Logout = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      if (isLoggingOut) return; // Prevent duplicate logout triggers
      setIsLoggingOut(true);

      // Clear cookies and session storage
      await clearCookies();
      sessionStorage.clear();

      console.log("Cookies and session cleared");

      // Redirect after ensuring cleanup
      router.replace("/");
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
