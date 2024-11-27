"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ViewModal from "../EmployeeBankRequestPage/ViewModal";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";
import { fetchCategoryList } from "@/app/controllers/categoryController";

const EmployeeNewRequest = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    all: [],
    approved: [],
    rejected: [],
  });
  const [formTemplateData, setFormTemplateData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
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
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const employeeId = "12345";
        const { Allrequests, formTemplateData } =
          await fetchAllEmployeeRequests(employeeId);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequestData();
  }, []);

  useEffect(() => {
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

    fetchCategoryData();
  }, []);

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
          {data.length > 0 ? (
            data.map((request, index) => {
              const formTemplate = formTemplateData.find(
                (template) => template._id === request.formTemplateId
              );
              return (
                <tr key={request._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {formTemplate?.templateName ||
                      request.request_name ||
                      "N/A"}
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

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white w-full">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && category.length > 0 && (
              <div>
                {category.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      className="font-semibold"
                      href={`${item.pageLink}/${item._id}`}
                    >
                      <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 cursor-pointer mb-2">
                        {item.categoryName}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
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
      <button
        onClick={toggleSidebar}
        className="md:hidden flex flex-col items-center justify-center p-4"
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 ${
            isSidebarOpen ? "rotate-45" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 ${isSidebarOpen ? "opacity-0" : ""}`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 ${isSidebarOpen ? "-rotate-45" : ""}`}
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

      <div className="flex-1 p-6 bg-gray-100">
        <div>
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === tab.key
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          {renderContent()}
        </div>
      </div>

      <ViewModal
        isOpen={isViewModalOpen}
        handleClose={closeViewModal}
        requestId={selectedRequestId}
      />
    </div>
  );
};

export default EmployeeNewRequest;
