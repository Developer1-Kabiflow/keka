"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("reached callback");
    const fetchTokens = async () => {
      const code = searchParams.get("code");
      console.log("code-->" + code);
      const state = searchParams.get("state");

      if (!code || !state) {
        console.error("Missing or invalid callback parameters.");
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
          const { user_id } = await response.json();
          console.log("user_id-->" + user_id);
          // Store user ID in cookies
          Cookies.set("userId", user_id, {
            expires: 1, // 1 day expiration
            path: "",
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
