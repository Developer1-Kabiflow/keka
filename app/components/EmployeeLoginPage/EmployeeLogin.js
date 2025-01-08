"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdLogIn } from "react-icons/io";
import Cookies from "js-cookie";
import { employeeLoginRequest } from "@/app/controllers/employeeController";

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
      const response = await employeeLoginRequest({ email, password });

      if (response.redirectUrl) {
        const cookieOptions = {
          expires: 1,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        };

        Cookies.set("LoggedinUserId", response.userId, cookieOptions);
        Cookies.set("isPassBasedAuth", true, cookieOptions);

        const redirectTo = Cookies.get("redirectTo") || response.redirectUrl;
        console.log("Redirecting to:", redirectTo);
        router.push(redirectTo);

        Cookies.remove("redirectTo");
      }
    } catch (err) {
      console.error("Login Error:", err.message || err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = () => {
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
          <IoMdLogIn className="w-16 h-16 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Employee Login
        </h2>
        <form className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-3 mb-4 rounded-md">
              <span>{error}</span>
            </div>
          )}
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
            disabled={loading}
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
