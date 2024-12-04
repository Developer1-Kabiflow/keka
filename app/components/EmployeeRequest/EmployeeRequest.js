"use client";

import React, { useState, useEffect, useMemo } from "react";
// import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import Link from "next/link";
import Modal from "./Modal";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";
import { fetchEmployeeDetails } from "@/app/controllers/employeeController";
import {
  fetchCategoryList,
  fetchSubCategoryList,
} from "@/app/controllers/categoryController";
import Cookies from "js-cookie";
import CategoryList from "./CategoryList";

const EmployeeRequest = ({ categoryId }) => {
  //const { categoryId } = params;
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [requestData, setRequestData] = useState({
    all: [],
    approved: [],
    rejected: [],
  });
  const [formTemplateData, setFormTemplateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategoryId, setSubCategoryId] = useState(null);
  const [category, setCategory] = useState([]);

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
  const loadRequestData = async (employeeId) => {
    try {
      const { Allrequests, formTemplateData } = await fetchAllEmployeeRequests(
        employeeId
      );
      const { Approvedrequests } = await fetchApprovedEmployeeRequests(
        employeeId
      );
      const { Rejectedrequests } = await fetchRejectedEmployeeRequests(
        employeeId
      );
      setRequestData({
        all: Allrequests,
        approved: Approvedrequests,
        rejected: Rejectedrequests,
      });
      setFormTemplateData(formTemplateData);
    } catch (err) {
      // setError(err.message || "Error fetching request data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId);
    }
    const fetchEmployee = async () => {
      try {
        const employeeId = Cookies.get("userId");
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

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };

  const renderTable = (data) => (
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
          {data && data.length > 0 ? (
            data.map((request, index) => (
              <tr key={request._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {request.request_name || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(
                    request.date || request.created_at
                  ).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {request.status || "Pending"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => openViewModal(request.request_id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white">
            {/* {category.map((item) => (
              <Link
                key={item._id}
                href={`${item.pageLink}/${item._id}`}
                className="block p-2 bg-green-100 rounded-md hover:bg-green-200 mb-2 text-center"
              >
                {item.categoryName}
              </Link>
            ))} */}

            < CategoryList />
          </div>
        );
      case "Track All Request":
        return renderTable(requestData.all);
      case "Track Approved Requests":
        return renderTable(requestData.approved);
      case "Track Rejected Requests":
        return renderTable(requestData.rejected);
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
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
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
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  }`}
                >
                  Track Rejected Requests
                </a>
              </li>
            </ul>

            <div className="flex flex-col md:flex-row bg-white shadow-lg mt-4 rounded-lg">
              <div className="w-full">{renderContent()}</div>
              
              
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalToggle}
        refreshData={refreshData}
        itemId={selectedSubCategoryId}
        onToast={handleToast}
      />
      <ViewModal
        isOpen={isViewModalOpen}
        handleClose={closeViewModal}
        requestId={selectedRequestId}
      />
    </div>
  );
};

export default EmployeeRequest;
