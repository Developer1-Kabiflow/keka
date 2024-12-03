"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the user-related cookies (e.g., authentication cookies)
    Cookies.remove("userId"); // Remove the cookie for user ID

    // Show a message that the user is being logged out
    setTimeout(() => {
      // Redirect to the login page after 2 seconds
      router.push("/"); // Replace with your actual login page route
    }, 2000); // You can adjust the delay as needed (2000ms = 2 seconds)
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
