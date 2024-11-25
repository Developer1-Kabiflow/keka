"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import Link from "next/link";
import Modal from "./Model";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";

const EmployeeBankRequest = () => {
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

  const tabs = useMemo(
    () => [
      { key: "New Request", label: "New Request" },
      { key: "Track All Request", label: "Track All Requests" },
      { key: "Track Approved Requests", label: "Approved Requests" },
      { key: "Track Rejected Requests", label: "Rejected Requests" },
    ],
    []
  );

  const links = useMemo(
    () => [
      { text: "Bank", path: "/employee/bankRequest" },
      { text: "Address", path: "/employee/addressRequest" },
      { text: "Payment", path: "/employee/paymentRequest" },
      { text: "Leave", path: "/employee/leaveRequest" },
    ],
    []
  );

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
        console.error("Error fetching request data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequestData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };
  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const getRequestType = (request, formTemplateData, isTrackAllRequest) => {
    if (isTrackAllRequest) {
      const formTemplate = formTemplateData.find(
        (template) => template._id === request.formTemplateId
      );
      return formTemplate ? formTemplate.templateName : "N/A";
    }
    return request.request_name || "N/A";
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
                  {getRequestType(request, formTemplateData, true)}
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
          <div className="flex flex-col md:flex-row">
            {/* Links Section */}
            <div className="p-4 bg-white md:w-1/2">
              {links.map((link, index) => (
                <Link key={index} href={link.path}>
                  <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 hover:cursor-pointer mb-2 w-full">
                    {link.text}
                  </p>
                </Link>
              ))}
            </div>

            {/* Additional Options Section */}
            <div className="flex flex-col p-4 bg-white md:w-1/2 text-center">
              <span className="font-semibold text-lg mb-4 underline decoration-4 decoration-blue-500">
                Bank Request
              </span>
              <span
                className="font-semibold cursor-pointer hover:text-blue-500"
                onClick={toggleModal}
              >
                Update Bank Name
              </span>
              <span className="font-semibold">Update Bank Account</span>
            </div>
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
      {/* Sidebar Toggle */}
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

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <EmployeeSidebar closeSidebar={toggleSidebar} />
      </div>
      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div>
          {/* Tabs */}
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b">
            {tabs.map((tab) => (
              <li key={tab.key} className="me-2">
                <a
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === tab.key
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div>{renderContent()}</div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
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

export default EmployeeBankRequest;
