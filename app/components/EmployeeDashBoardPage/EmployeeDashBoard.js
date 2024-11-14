'use client'
import React, { useState } from "react";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";

const EmployeeDashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden flex flex-col items-center justify-center p-4"
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 transition-transform duration-300 ${
            isSidebarOpen ? "rotate-45 transform origin-center" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-0" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mt-1 transition-transform duration-300 ${
            isSidebarOpen ? "-rotate-45 transform origin-center" : ""
          }`}
        />
      </button>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-gray-800 bg-opacity-75 transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <EmployeeSidebar closeSidebar={toggleSidebar} />
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "ml-0" : "md:ml-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex bg-gray-300 w-full h-96 p-4 rounded-xl items-center justify-center">
            Update List
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashBoard;
