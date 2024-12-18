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
  const [employeeId, setEmployeeId] = useState();
  const handleItemClick = () => {
    if (isMobileOrTablet && closeSidebar) {
      closeSidebar();
    }
  };

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      // try {
      const isSSO = Cookies.get("SSO");
      console.log("isSSO-->", isSSO);
      const userId = Cookies.get("userId");
      console.log("userId-->", userId);
      const Department = Cookies.get("Department");
      console.log("Department-->", Department);
      const Designation = Cookies.get("Designation");
      console.log("Designation-->", Designation);
      const email = Cookies.get("email");
      console.log("email-->", email);
      const idFromCookie =
        isSSO === "true" ? Cookies.get("kekaId") : Cookies.get("userId");
      console.log("idFromCookie-->" + idFromCookie);
      //   if (!idFromCookie) {
      //     return; // Continue polling until ID is available in cookies
      //   }
      //   const userId = Cookies.get("SSO");
      //   setEmployeeId(idFromCookie); // Save it in state if needed for other purposes

      //   // Fetch employee details
      //   const { userData } = await fetchEmployeeDetails(idFromCookie);
      //   setEmployeeData(userData);

      //   // Save `userId` in cookies if needed
      //   Cookies.set("userId", userData.EmployeeId, {
      //     expires: 1,
      //     path: "/",
      //     secure: true,
      //     sameSite: "Strict",
      //   });

      //   setIsLoading(false); // Data fetched, stop loading

      //   // Stop polling once data is fetched successfully
      //   if (interval) {
      //     clearInterval(interval);
      //   }
      // } catch (err) {
      //   setError(err.message || "Error fetching employee details.");
      //   setIsLoading(false);
      // }
    };

    // Poll every 500ms to check if userId is available in cookies
    // interval = setInterval(fetchData, 500);

    // Cleanup interval on component unmount
    // return () => clearInterval(interval);
  }, []);

  const getActiveClass = (path) => {
    return pathname === path ? "bg-gray-300 font-semibold" : "";
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
            {isLoading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-40 bg-gray-300 rounded"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
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
                  {employeeData?.JobTitle?.title}
                </span>
                <span className="mt-1 text-sm font-medium text-gray-600">
                  {employeeData?.Department?.title} Department
                </span>
                <span className="mt-1 text-sm text-gray-500 mb-4">
                  {employeeData?.Email}
                </span>
              </>
            )}
          </li>
          <li
            className={`mb-2 ${getActiveClass("/employee/request")}`}
            onClick={handleItemClick}
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
