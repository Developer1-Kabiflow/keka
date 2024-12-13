"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const fetchTokens = async () => {
      const { code, state } = router.query;

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
      });

      try {
        const response = await fetch(tokenUrl, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.access_token) {
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
  }, [router]);

  return <div>Loading...</div>;
}
