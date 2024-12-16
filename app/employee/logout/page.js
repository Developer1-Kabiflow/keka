"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("userId", { path: "/" });
    // document.cookie.split(";").forEach((cookie) => {
    //   // Split the cookie string into name and value using '='
    //   // const [name] = cookie.split("=").map((part) => part.trim());
    //   // Attempt to delete the cookie for different paths
    //   // const paths = ["/", "/employee"]; // Add paths as needed
    //   // paths.forEach((path) => {
    //   //   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
    //   // });
    // });

    setTimeout(() => {
      router.push("/");
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
