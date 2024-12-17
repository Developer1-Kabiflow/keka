"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      const code = searchParams.get("code");
      console.log("code:" + code);
      if (!code) {
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
        console.log("accessToken:", access_token);
        if (!access_token) {
          throw new Error("Access token is missing in the response.");
        }

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
          console.log("user_id:", user_id);
          const isSSO = true;
          await new Promise((resolve) => {
            Cookies.set("kekaId", user_id, {
              expires: 1,
              path: "/",
              secure: true,
              sameSite: "Strict",
            });
            Cookies.set("SSO", isSSO, {
              expires: 1,
              path: "/",
              secure: true,
              sameSite: "Strict",
            });
            resolve();
          });
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

  return null; // Return null when not loading
}
