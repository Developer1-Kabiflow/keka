"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");

    if (authCode) {
      // Exchange the authorization code for an access token
      fetchAccessToken(authCode);
    } else {
      // Handle error if no authorization code is present
      alert("Authorization failed! Redirecting to login.");
      router.push("/login");
    }
  }, []);

  const fetchAccessToken = async (authCode) => {
    const url = "https://login.keka.com/connect/token";
    const formData = new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      client_id: "d2eef869-9daf-4a4e-aea6-0982ea0d787b", // Replace with your actual client_id
      client_secret: "W3qwPhJdoEbk8YjhSoKz", // Replace with your actual client_secret
      redirect_uri: "http://localhost:3000/callback", // Must match the registered redirect URI
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Save the access token (in localStorage or secure cookie)
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard"); // Redirect to the dashboard
      } else {
        // Handle token exchange failure
        console.error("Token exchange failed:", await response.text());
        alert("SSO Login failed! Redirecting to login.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during token exchange:", error);
      router.push("/login");
    }
  };

  return <div>Processing your login...</div>;
}
