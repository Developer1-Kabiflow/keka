"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token"); // Get token from cookie

      // if (!accessToken) {
      //   router.push("/login"); // Redirect to login if no access token
      //   return;
      // }

      const apiUrl = "https://login.kekademo.com/connect/userinfo";
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      };

      try {
        const response = await fetch(apiUrl, { method: "GET", headers });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // } else if (response.status === 401) {
          //   console.error("Unauthorized access. Redirecting to login.");
          //   router.push("/");
        } else {
          throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user information.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h2>Welcome, {userData?.name || "User"}!</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
