"use client";
import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import Link from "next/link";
import Modal from "./Model";
import ViewModal from "./ViewModal";
import {
  fetchEmployeeDetails,
  fetchEmployeeRequests,
} from "@/app/controllers/employeeController";
import { fetchSubCategoryList } from "@/app/controllers/subCategoryController";
import { fetchCategoryList } from "@/app/controllers/categoryController";

import Cookies from "js-cookie";

const EmployeeBankRequest = (params) => {
  const { categoryId } = params;
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [formTemplateData, setFormTemplateData] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [SelectedRequestId, setSelectedRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategoryId, setSubCategoryId] = useState(null);
  const [category, setCategory] = useState([]);

  const [links] = useState([
    { text: "Bank", path: "/employee/bankRequest" },
    { text: "Address", path: "/employee/bankRequest" },
    { text: "Payment", path: "/employee/bankRequest" },
    { text: "Leave", path: "/employee/bankRequest" },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Fetch employeeId from cookies
        const employeeId = Cookies.get("userId");

        console.log("employeeId first: ", employeeId);

        // Proceed only if the employeeId exists
        if (employeeId) {
          const { userData } = await fetchEmployeeDetails(employeeId);
          setEmployeeDetails(userData.employeeDetails);
        } else {
          console.error("No employeeId found in cookies.");
          setError("Employee ID not found.");
        }
        setLoading(false); // Turn off the loading state after fetching
      } catch (error) {
        console.error(
          "Error fetching employee details:",
          error.message || error
        );
        setError(
          error.message || "An error occurred while fetching employee data."
        );
        setLoading(false); // Make sure to stop loading even on error
      }
    };
    const loadRequestData = async () => {
      try {
        const employeeId = "12345"; // Replace this with a dynamic value

        console.log("employeeId: ", employeeId);
        const { requests, formTemplates } = await fetchEmployeeRequests(
          employeeId
        );
        setRequestData(requests.employee_request_list);
        setFormTemplateData(formTemplates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching request data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCategoryData = async () => {
      try {
        const categoryList = await fetchCategoryList();
        console.log("Category List:", categoryList.category); // This should now be an array
        setCategory(categoryList.category); // Set the array into state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchSubcategories = async () => {
      try {
        if (!categoryId) {
          console.warn("Category ID is missing. Skipping fetch.");
          return;
        }
        const { subCategoryList } = await fetchSubCategoryList(categoryId);
        setSubCategoryList(subCategoryList || []); // Set as an empty array if undefined
        console.log("Fetched Subcategories:", subCategoryList);
      } catch (error) {
        console.error("Error fetching subcategories:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
    loadRequestData();
    fetchCategoryData();
    fetchSubcategories();
  }, [categoryId]);

  console.log("categoryId", categoryId);

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

  const renderContent = () => {
    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white w-full max-w-[600px]">
            {loading && <p>Loading...</p>}
            {error && (
              <p className="text-center text-red-500">Error: {error}</p>
            )}
            {!loading && !error && category.length > 0 && (
              <div>
                {category.map((item) => (
                  <Link
                    key={item._id}
                    className="font-semibold block"
                    href={`${item.pageLink}/${item._id}`}
                  >
                    <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 cursor-pointer mb-2 text-center">
                      {item.categoryName}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      case "Track Request":
        return (
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
                {requestData && requestData.length > 0 ? (
                  requestData.map((request, index) => {
                    const formTemplate = formTemplateData.find(
                      (template) => template._id === request.formTemplateId
                    );
                    return (
                      <tr key={request._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {formTemplate ? formTemplate.templateName : "N/A"}
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
                    );
                  })
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
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <button
        onClick={toggleSidebar}
        className="md:hidden flex flex-col items-center justify-center p-4"
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 transition-transform ${
            isSidebarOpen ? "rotate-45" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 ${
            isSidebarOpen ? "opacity-0" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mt-1 transition-transform ${
            isSidebarOpen ? "-rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-gray-800 bg-opacity-75 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <EmployeeSidebar closeSidebar={toggleSidebar} />
      </div>

      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "ml-0" : "md:ml-0"
        }`}
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
                  onClick={() => setActiveTab("Track Request")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "Track Request"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  }`}
                >
                  Track Request
                </a>
              </li>
            </ul>

            <div className="flex flex-col md:flex-row bg-white shadow-lg mt-4 rounded-lg">
              <div className="w-full">{renderContent()}</div>
              {activeTab === "New Request" && (
                <div className="flex flex-col p-4 bg-white md:w-1/2 text-center">
                  <span className="font-semibold text-lg mb-4 underline decoration-4 decoration-blue-500">
                    Bank Request
                  </span>
                  {loading ? (
                    <p>Loading subcategories...</p>
                  ) : subCategoryList.length > 0 ? (
                    subCategoryList.map((item) => (
                      <div key={item._id} className="mb-4">
                        <span
                          className="font-semibold cursor-pointer hover:text-blue-500"
                          onClick={() =>
                            handleModalToggle(item.form_template_id)
                          }
                        >
                          {item.subcategoryName}
                        </span>
                        {/* <span className="font-semibold block">{item.form_template_name}</span> */}
                      </div>
                    ))
                  ) : (
                    <p>No subcategories available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalToggle}
        itemId={selectedSubCategoryId}
      />
      <ViewModal
        isOpen={isViewModalOpen}
        handleClose={closeViewModal}
        requestId={SelectedRequestId}
      />
    </div>
  );
};

export default EmployeeBankRequest;
