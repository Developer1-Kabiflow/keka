'use client';

import { employeeLoginRequest } from '@/app/controllers/employeeController';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from 'react';
import { IoMdLogIn } from "react-icons/io";

import Cookies from 'js-cookie'; 


const EmployeeLoginPage = () => {
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter(); // Use the router hook

  // Ensure the component only uses `useRouter` on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = { email, password };
      console.log("Form Data Submitted:", formData);

      const response = await employeeLoginRequest(formData);
      console.log("API Response:", response);

      if (response.redirectUrl) {
        console.log("Redirecting to:", response.redirectUrl);
        console.log("user Id: ", response.userId);
        Cookies.set('userId', response.userId, { expires: 1, path: '', secure: true, sameSite: 'Strict' }); 
        router.push(response.redirectUrl); 
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

  if (!isClient) {
    return null; // Optionally render a loading spinner or nothing until the client is ready
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-4">
          <IoMdLogIn className='w-16 h-16' />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Employee Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
