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
  const [employeeId, setEmployeeId] = useState([]);
  const [displayName, setDisplayName] = useState([]);
  const [email, setEmail] = useState([]);
  const [department, setDepartment] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);
  // Function to handle closing the sidebar on mobile/tablet
  const handleItemClick = () => {
    if (isMobileOrTablet && closeSidebar) {
      closeSidebar();
    }
  };
  const getEmployeeDetails = async () => {
    const employeeId = Cookies.get("userId");
    try {
      if (!employeeId) {
        throw new Error("No employee ID found in cookies.");
      }
      const { userData } = await fetchEmployeeDetails(employeeId);
      const { EmployeeId, DisplayName, Email, Department, JobTitle } = userData;
      setEmployeeId(EmployeeId);
      setDisplayName(DisplayName);
      setEmail(Email);
      setDepartment(Department);
      setJobTitle(JobTitle);
    } catch (err) {
      setError(err.message || "Error fetching employee details.");
    }
  };
  useEffect(() => {
    getEmployeeDetails();
  }, []);
  // Helper function to determine if an item is active based on pathname
  const getActiveClass = (path) => {
    // Check if the current pathname exactly matches "/employee/request"
    if (pathname === path) {
      return "bg-gray-300 font-semibold"; // Highlight if on "/employee/request"
    }

    // Check if the current pathname includes "/employee/bankRequest"
    // Only highlight the "Request" link if pathname includes "/employee/bankRequest"
    if (pathname.includes("/employee/bankRequest")) {
      return path === "/employee/request" ? "bg-gray-300 font-semibold" : "";
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
          <li className="mb-8 flex flex-col justify-center items-center bg-blue-100 p-4 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 ease-in-out">
            <Image
              src="/1.jpg"
              alt="profile_pic"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
              priority
              width={80}
              height={80}
            />
            <span className="mt-3 text-xl font-semibold text-blue-900">
              {displayName} ({employeeId})
            </span>
            <span className="mt-1 text-sm font-medium text-gray-600">
              {jobTitle}
            </span>
            <span className="mt-1 text-sm font-medium text-gray-600">
              {department} Department
            </span>
            <span className="mt-1 text-sm text-gray-500 mb-4">{email}</span>

            <div className="flex gap-2 mt-3">
              <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                Active
              </span>
              <span className="bg-yellow-500 text-white text-xs py-1 px-2 rounded-full">
                Full-time
              </span>
            </div>
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
