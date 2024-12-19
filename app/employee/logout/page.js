"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear cookies and session storage
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userInfo", { path: "/" });
    sessionStorage.clear();

    console.log("Cleared cookies and session storage");
    console.log("Remaining cookies:", document.cookie);

    // Redirect after ensuring cleanup
    setTimeout(() => {
      router.replace("/");
      location.reload(); // Clear any stale cache
    }, 2000);
  }, [router]);

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
