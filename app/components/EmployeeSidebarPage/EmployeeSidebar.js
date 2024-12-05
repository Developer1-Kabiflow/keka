"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/app/hooks/useMediaQuery"; // Import the custom hook
import { getMyFormData } from "@/app/controllers/formController";
import { fetchAllRequests } from "@/app/models/requestModels";
import Cookies from "js-cookie";

const EmployeeSidebar = ({ closeSidebar }) => {
  const pathname = usePathname(); // Get the current pathname
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    employeeID: "EmployeeID",
    loading: true,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        const userId = Cookies.get("userId");
        if (!userId) throw new Error("User ID not found in cookies.");

        // Fetch all requests to get the first request ID
        const { requests } = await fetchAllRequests(userId);
        const firstRequest = requests?.employee_request_list?.[0];
        if (!firstRequest) throw new Error("No requests available.");

        // Fetch form data for the first request
        const { requestData } = await getMyFormData(firstRequest.request_id);
        if (!requestData?.fields)
          throw new Error("No fields found in the response.");

        const fields = requestData.fields;
        const firstNameField = fields.find(
          (field) =>
            field.field_name === "First Name" ||
            field.field_name === "employeeName"
        );
        const lastNameField = fields.find(
          (field) => field.field_name === "lastName"
        );
        const employeeIdField = fields.find(
          (field) => field.field_name === "EmployeeId"
        );

        setEmployeeDetails({
          firstName: firstNameField?.field_value || "First Name",
          lastName: lastNameField?.field_value || " ",
          employeeID: employeeIdField?.field_value || "E001",
          loading: false,
        });
      } catch (error) {
        console.error("Error initializing data:", error.message);
        setEmployeeDetails((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeData();
  }, []);

  const handleItemClick = () => {
    if (isMobileOrTablet && closeSidebar) closeSidebar();
  };

  const getActiveClass = (path) =>
    pathname === path ? "bg-gray-300 font-semibold" : "";

  const { firstName, lastName, employeeID, loading } = employeeDetails;

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
          <li className="mb-8 flex flex-col justify-center items-center bg-blue-200">
            <Image
              src="/1.jpg"
              alt="profile_pic"
              className="w-16 h-16 rounded-full mt-4"
              priority
              width={64}
              height={64}
            />
            <span className="mt-2 font-bold">
              {loading ? "Loading..." : `${firstName} ${lastName}`}
            </span>
            <span className="mt-1 font-normal mb-4">
              {loading ? "Loading..." : employeeID}
            </span>
          </li>

          {/* Links with conditional class based on pathname */}
          {[
            "/employee/request",
            "/employee/approvals",
            "/employee/task",
            "/employee/logout",
          ].map((path) => (
            <li
              key={path}
              className={`mb-2 ${getActiveClass(path)}`}
              onClick={handleItemClick}
            >
              <Link href={path}>
                <span className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
                  {path.split("/").pop()}
                </span>
              </Link>
            </li>
          ))}
          <li className="mb-2" onClick={handleItemClick}>
            <p className="block py-2 px-4 hover:bg-gray-200 hover:cursor-pointer">
              Notification
            </p>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
