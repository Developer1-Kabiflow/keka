"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { fetchEmployeeDetails } from "@/app/controllers/employeeController";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchTokens = async () => {
      const code = searchParams.get("code");
      console.log("code:", code);
      if (!code) {
        console.error("Missing or invalid callback parameters.");
        setError("Missing or invalid callback parameters."); // Set error state
        router.push("/"); // Redirect to login page on error
        return;
      }

      const tokenUrl = "https://login.kekademo.com/connect/token";
      const formData = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      });

      try {
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Token exchange failed: ${errorData.error || response.statusText}`
          );
        }

        const { access_token } = await response.json();
        console.log("accessToken:", access_token);
        if (!access_token) {
          throw new Error("Access token is missing in the response.");
        }

        // Proceed to fetch user data
        await fetchUserData(access_token);
      } catch (error) {
        console.error("Error during token exchange:", error.message);
        setError(error.message); // Set error state
        router.push("/"); // Redirect to login page
      }
    };

    const fetchUserData = async (accessToken) => {
      const apiUrl = "https://login.kekademo.com/connect/userinfo";

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const userInfo = await response.json();
          const { user_id } = userInfo;
          const { userData } = await fetchEmployeeDetails(user_id);
          const isSSO = true;
          Cookies.set("LoggedinUserId", response.user_id, {
            expires: 1,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Lax", // Default cross-site setting for navigation requests
          });
          const cookieData = {
            kekaId: user_id,
            userName: userData?.DisplayName,
            Designation: userData?.JobTitle?.title,
            Department: userData?.Department?.title,
            email: userData?.Email,
            SSO: isSSO,
            EmployeeId: userData?.EmployeeId,
          };

          // Set a single cookie with all data
          Cookies.set("userInfo", JSON.stringify(cookieData), {
            expires: 1,
            path: "/",
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Lax", // Default cross-site setting for navigation requests
          });

          const cookieRedirectTo = Cookies.get("redirectTo");
          Cookies.remove("redirectTo");
          if (cookieRedirectTo) {
            console.log("Redirect URL found in cookies:", cookieRedirectTo);
            Cookies.remove("redirectTo"); // Clean up cookie after use
            router.push(cookieRedirectTo); // Redirect to saved URL
          } else {
            // Fallback to dashboard if no redirectTo cookie
            router.push("/employee/dashboard");
          }
        } else if (response.status === 401) {
          console.error("Unauthorized access. Redirecting to login.");
          setError("Unauthorized access. Redirecting to login.");
          router.push("/"); // Redirect to login page
        } else {
          throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setError(error.message); // Set error state
        router.push("/"); // Redirect to login page on error
      } finally {
        setLoading(false);
      }
    };

    // Start the token fetch process
    fetchTokens();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsating Glow */}
          <div className="absolute w-36 h-36 rounded-full bg-gray-400 opacity-50 blur-lg animate-pulse"></div>

          {/* Middle Rotating Ring */}
          <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-gray-500"></div>

          {/* Inner Expanding Dots */}
          <div className="absolute flex space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-75"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-150"></div>
            <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-300"></div>
          </div>

          {/* Center Static Core */}
          <div className="z-10 h-12 w-12 bg-gray-500 rounded-full shadow-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if there is one
  }

  return null; // Return null when not loading and no error
}
