"use client";

import { employeeLoginRequest } from "@/app/controllers/employeeController";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";
import Cookies from "js-cookie";

const EmployeeLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = { email, password };
      const response = await employeeLoginRequest(formData);

      if (response.redirectUrl) {
        Cookies.set("LoggedinUserId", response.userId, {
          expires: 1,
          path: "/",
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "Lax", // Default cross-site setting for navigation requests
        });

        Cookies.set("isPassBasedAuth", true, {
          expires: 1,
          path: "/",
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "Lax", // Default cross-site setting for navigation requests
        });

        const finalRedirectTo =
          Cookies.get("redirectTo") || response.redirectUrl;

        console.log("Redirecting to:", finalRedirectTo);

        router.push(finalRedirectTo);
        // Redirect to the original URL
        Cookies.remove("redirectTo"); // Clean up the cookie after redirection
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login Error:", err.message || err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async (e) => {
    e.preventDefault();
    console.log("reached handleSSOLogin");
    const authorizeUrl = "https://login.kekademo.com/connect/authorize";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      state: "test",
      scope: "openid",
    });
    window.location.href = `${authorizeUrl}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-4">
          <IoMdLogIn className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Employee Login
        </h2>
        <form className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-4 text-center">
            <button
              onClick={handleSSOLogin}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
            >
              Login with SSO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
