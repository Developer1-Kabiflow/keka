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
        code: "https://keka-1spk.vercel.app/employee/callback",
        client_id: "bb15d67c-dd06-44c2-8672-2439914200bb",
        client_secret: "Q9zAtxUiVhhRyAkHqxh1", // Use environment variables for sensitive data
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
          router.push("/dashboard"); // Redirect to the desired page after successful login
        } else {
          console.error("Failed to retrieve tokens:", data);
        }
      } catch (error) {
        console.error("Error exchanging authorization code:", error);
      }
    };

    fetchTokens();
  }, [router.query]);

  return <div>Loading...</div>;
}
