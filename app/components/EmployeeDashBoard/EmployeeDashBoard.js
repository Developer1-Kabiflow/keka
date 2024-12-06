"use client";
import React from "react";

const EmployeeDashBoard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Welcome Back!</h1>
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 mt-2">
          Here's an overview of your tasks and updates.
        </p>
      </div>

      {/* Skeleton Loading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-48 bg-gray-200 rounded-md"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-48 bg-gray-200 rounded-md"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-48 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Statistic Card 1 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.954L9 2m5 18l5.447-2.724A2 2 0 0021 15.382V6.618a2 2 0 00-1.553-1.954L15 2m-6 18V2m6 18V2"
            />
          </svg>
          <div>
            <h3 className="text-lg font-bold">Pending Approvals</h3>
            <p className="text-sm">12 approvals waiting</p>
          </div>
        </div>

        {/* Statistic Card 2 */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v11a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-bold">Completed Tasks</h3>
            <p className="text-sm">24 tasks done</p>
          </div>
        </div>
      </div>

      {/* Updates List Placeholder */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Updates
        </h2>
        <div className="bg-gray-300 w-full h-32 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default EmployeeDashBoard;
