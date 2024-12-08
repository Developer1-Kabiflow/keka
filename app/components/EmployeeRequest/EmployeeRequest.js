"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { fetchEmployeeDetails } from "@/app/controllers/employeeController";
import Cookies from "js-cookie";
import CategoryList from "./CategoryList";
import TrackAllRequest from "./TrackAllRequest";
import TrackApprovedRequest from "./TrackApprovedRequest";
import TrackRejectedRequest from "./TrackRejectedRequest";

const EmployeeRequest = ({ categoryId }) => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = useMemo(
    () => [
      { key: "New Request", label: "New Request" },
      { key: "Track All Request", label: "Track All Requests" },
      { key: "Track Approved Requests", label: "Approved Requests" },
      { key: "Track Rejected Requests", label: "Rejected Requests" },
    ],
    []
  );
  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  useEffect(() => {
    const employeeId = Cookies.get("userId");
    const fetchEmployee = async () => {
      try {
        if (!employeeId) {
          throw new Error("No employee ID found in cookies.");
        }
        const { userData } = await fetchEmployeeDetails(employeeId);
        setEmployeeDetails(userData.employeeDetails);
      } catch (err) {
        setError(err.message || "Error fetching employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [categoryId]);

  const refreshData = () => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId);
    }
  };

  const handleModalToggle = (itemId) => {
    setSubCategoryId(itemId);
    setIsModalOpen(!isModalOpen);
  };

  const renderContent = () => {
    if (loading) return;
    <div className="p-4 bg-white overflow-auto">
      <table className="table-auto w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Request Type</th>
            <th className="px-4 py-2">Request Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Skeleton Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="border px-4 py-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="border px-4 py-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="border px-4 py-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="border px-4 py-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </td>
              <td className="border px-4 py-2">
                <div className="h-4 bg-gray-300 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>;
    if (error)
      return (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-gray-700 font-medium">{error}</p>
          </div>
        </div>
      );

    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white">
            <CategoryList />
          </div>
        );
      case "Track All Request":
        return <TrackAllRequest />;
      case "Track Approved Requests":
        return <TrackApprovedRequest />;
      case "Track Rejected Requests":
        return <TrackRejectedRequest />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 md:ml-0`}
      >
        <div className="container mx-auto px-4">
          <div>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
              <li className="me-2">
                <a
                  onClick={() => setActiveTab("New Request")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "New Request"
                      ? "text-blue-600 font-bold bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  New Request
                </a>
              </li>
              <li className="me-2">
                <a
                  onClick={() => setActiveTab("Track All Request")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "Track All Request"
                      ? "text-blue-600 font-bold bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Track All Request
                </a>
              </li>
              <li className="me-2">
                <a
                  onClick={() => setActiveTab("Track Approved Requests")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "Track Approved Requests"
                      ? "text-blue-600 font-bold bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Track Approved Requests
                </a>
              </li>
              <li className="me-2">
                <a
                  onClick={() => setActiveTab("Track Rejected Requests")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "Track Rejected Requests"
                      ? "text-blue-600 font-bold bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Track Rejected Requests
                </a>
              </li>
            </ul>

            <div>
              <div className="w-full">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRequest;
