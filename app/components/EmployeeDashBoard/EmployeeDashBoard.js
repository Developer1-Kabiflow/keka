"use client";
import React from "react";

const EmployeeDashBoard = () => {
  return (
    <div
      className="flex-1 p-6 bg-gray-100"
      // This ensures the dashboard layout adapts within the sidebar's context
    >
      <div>
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
