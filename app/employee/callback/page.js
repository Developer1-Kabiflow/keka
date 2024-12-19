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

          const cookieData = {
            kekaId: user_id,
            userName: userData?.DisplayName,
            Designation: userData?.JobTitle?.title,
            Department: userData?.Department?.title,
            email: userData?.Email,
            SSO: isSSO,
          };

          // Set a single cookie with all data
          Cookies.set("userInfo", JSON.stringify(cookieData), {
            expires: 1,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("userId", userData?.EmployeeId, {
            expires: 1,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });

          const cookieRedirectTo = Cookies.get("redirectTo");

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if there is one
  }

  return null; // Return null when not loading and no error
}
