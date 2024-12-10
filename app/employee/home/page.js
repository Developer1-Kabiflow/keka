"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    } else {
      fetchUserData(accessToken);
    }
  }, []);

  const fetchUserData = async (accessToken) => {
    const apiUrl = "https://alinco.keka.com/api/v1/hris/employees";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": "your_api_key", // Replace with your API key
    };

    try {
      const response = await fetch(apiUrl, { headers });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
