"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use Next.js's hook to access query parameters

  useEffect(() => {
    const fetchTokens = async () => {
      // Extract `code` and `state` from the query parameters
      const code = searchParams.get("code");
      const state = searchParams.get("state"); // If you need the state parameter for validation

      console.log("Extracted code:", code);

      if (!code || !state) {
        console.error("Invalid callback parameters");
        return;
      }

      const tokenUrl = "https://login.kekademo.com/connect/token";
      const formData = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET, // Use environment variables for sensitive data
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI, // Ensure you include the redirect URI
      });

      try {
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        const data = await response.json();
        console.log("access tokn:" + data);
        if (response.ok && data.access_token) {
          Cookies.set("access_token", data.access_token, {
            secure: true,
            sameSite: "Strict",
          });
          router.push("/employee/dashboard"); // Redirect to the desired page after successful login
        } else {
          console.error("Failed to retrieve tokens:", data);
        }
      } catch (error) {
        console.error("Error exchanging authorization code:", error);
      }
    };

    fetchTokens();
  }, [router, searchParams]);

  return <div>Loading...</div>;
}
