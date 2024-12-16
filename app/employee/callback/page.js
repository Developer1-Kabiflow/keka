"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTokens = async () => {
      const code = searchParams.get("code");
      console.log("code-->" + code);
      const state = searchParams.get("state");

      if (!code || !state) {
        console.error("Missing or invalid callback parameters.");
        router.push("/"); // Redirect to login page on error
        return;
      }
      console.log("NEXT_PUBLIC_CLIENT_ID-->" + NEXT_PUBLIC_CLIENT_ID);
      console.log("NEXT_PUBLIC_CLIENT_SECRET-->" + NEXT_PUBLIC_CLIENT_SECRET);
      console.log("NEXT_PUBLIC_REDIRECT_URI-->" + NEXT_PUBLIC_REDIRECT_URI);
      // Ensure required environment variables are set
      // const {
      //   NEXT_PUBLIC_CLIENT_ID,
      //   NEXT_PUBLIC_CLIENT_SECRET,
      //   NEXT_PUBLIC_REDIRECT_URI,
      // } = process.env;
      // if (
      //   !NEXT_PUBLIC_CLIENT_ID ||
      //   !NEXT_PUBLIC_CLIENT_SECRET ||
      //   !NEXT_PUBLIC_REDIRECT_URI
      // ) {
      //   console.error("Missing required environment variables.");
      //   router.push("/"); // Redirect to login page
      //   return;
      // }

      const tokenUrl = "https://login.kekademo.com/connect/token";
      const formData = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: NEXT_PUBLIC_CLIENT_ID,
        client_secret: NEXT_PUBLIC_CLIENT_SECRET,
        redirect_uri: NEXT_PUBLIC_REDIRECT_URI,
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
        console.log("accessToken:" + access_token);
        if (!access_token)
          throw new Error("Access token is missing in the response.");

        // Proceed to fetch user data
        await fetchUserData(access_token);
      } catch (error) {
        console.error("Error during token exchange:", error.message);
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
          const userData = await response.json();

          // Store user ID in cookies
          Cookies.set("userId", userData.EmployeePersonalId, {
            expires: 1, // 1 day expiration
            path: "/",
            secure: true,
            sameSite: "Strict",
          });

          // Redirect to dashboard after successful login
          router.push("/employee/dashboard");
        } else if (response.status === 401) {
          console.error("Unauthorized access. Redirecting to login.");
          router.push("/");
        } else {
          throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        router.push("/"); // Redirect to login page on error
      }
    };

    fetchTokens();
  }, [router, searchParams]);

  return <div>Loading...</div>;
}
