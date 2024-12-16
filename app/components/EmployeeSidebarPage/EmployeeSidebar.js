"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/app/hooks/useMediaQuery"; // Import the custom hook
import Cookies from "js-cookie";
import { fetchEmployeeDetails } from "@/app/controllers/employeeController";

const EmployeeSidebar = ({ closeSidebar }) => {
  const pathname = usePathname(); // Get the current pathname
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)"); // Detect mobile or tablet screen size
  const [employeeData, setEmployeeData] = useState(null); // Store employee data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleItemClick = () => {
    if (isMobileOrTablet && closeSidebar) {
      closeSidebar();
    }
  };

  const getEmployeeDetails = async () => {
    const employeeId = Cookies.get("userId");
    console.log("employeeId-->" + employeeId);
    try {
      if (!employeeId) {
        throw new Error("No employee ID found in cookies.");
      }
      const { userData } = await fetchEmployeeDetails(employeeId);
      setEmployeeData(userData);
    } catch (err) {
      setError(err.message || "Error fetching employee details.");
    } finally {
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const getActiveClass = (path) => {
    if (pathname === path) {
      return "bg-gray-300 font-semibold"; // Highlight if on "/employee/request"
    }
    return ""; // Default class if no conditions are met
  };

  return (
    <div className="w-64 h-full bg-blue-50 text-black fixed md:static">
      <div className="p-4 md:p-0 text-2xl font-bold flex justify-between items-center">
        {closeSidebar && isMobileOrTablet && (
          <button onClick={closeSidebar} className="md:hidden text-black ml-24">
            &times;
          </button>
        )}
      </div>
      <nav className="mt-0">
        <ul>
          {/* Skeleton loader or actual employee details */}
          <li className="mb-8 flex flex-col justify-center items-center bg-blue-100 p-4 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 ease-in-out">
            {isLoading ? (
              // Skeleton Loader
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-40 bg-gray-300 rounded"></div>
              </div>
            ) : error ? (
              // Error Message
              <div className="text-red-500 text-sm">
                {error || "Error loading data"}
              </div>
            ) : (
              // Employee Details
              <>
                <Image
                  src="/1.jpg"
                  alt="profile_pic"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                  priority
                  width={80}
                  height={80}
                  style={{ width: "auto", height: "auto" }}
                />
                <span className="mt-3 text-xl font-semibold text-blue-900">
                  {employeeData?.DisplayName} ({employeeData?.EmployeeId})
                </span>
                <span className="mt-1 text-sm font-medium text-gray-600">
                  {employeeData?.JobTitle}
                </span>
                <span className="mt-1 text-sm font-medium text-gray-600">
                  {employeeData?.Department} Department
                </span>
                <span className="mt-1 text-sm text-gray-500 mb-4">
                  {employeeData?.Email}
                </span>
              </>
            )}
          </li>

          {/* Links with conditional class based on pathname */}
          <li
            className={`mb-2 ${getActiveClass("/employee/request")}`}
            onClick={handleItemClick}
            id="request"
          >
            <Link href="/employee/request">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
                Request
              </span>
            </Link>
          </li>
          <li
            className={`mb-2 ${getActiveClass("/employee/approvals")}`}
            onClick={handleItemClick}
          >
            <Link href="/employee/approvals">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
                Approvals
              </span>
            </Link>
          </li>
          <li
            className={`mb-2 ${getActiveClass("/employee/task")}`}
            onClick={handleItemClick}
          >
            <Link href="/employee/task">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
                Task
              </span>
            </Link>
          </li>
          <li className="mb-2" onClick={handleItemClick}>
            <p className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
              Notification
            </p>
          </li>
          <li
            className={`mb-2 ${getActiveClass("/employee/loginTest")}`}
            onClick={handleItemClick}
          >
            {" "}
            <Link href="/employee/loginTest">
              <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
                Login Test
              </span>
            </Link>
          </li>
          <li
            className={`mb-2 ${getActiveClass("/employee/logout")}`}
            onClick={handleItemClick}
          >
            <Link href="/employee/logout">
              <span className="block py-2 px-4 hover:bg-gray-200">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
