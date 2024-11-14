"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import Modal from "./Modal";
import axios from "axios";
import ViewModal from "./ViewModal";
import BASE_URL from "@/utils/utils";

const EmployeeBankRequest = () => {
  const [requestData, setRequestData] = useState([]);
  const [formTemplateData, setFormTemplateData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const links = [
    { text: "Bank", path: "/employee/bankRequest" },
    { text: "Address", path: "/employee/bankRequest" },
    { text: "Payment", path: "/employee/bankRequest" },
    { text: "Leave", path: "/employee/bankRequest" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const employeeId = "12345";
        const response = await axios.get(
          `${BASE_URL}/trackRequest/myRequest/${employeeId}`
        );
        const { requests, formTemplates } = response.data;
        setRequestData(requests);
        setFormTemplateData(formTemplates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching request data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRequestData();
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openViewModal = () => {
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white">
            {links.map((link, index) => (
              <Link key={index} href={link.path}>
                <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 hover:cursor-pointer mb-2 w-full md:w-[600px]">
                  {link.text}
                </p>
              </Link>
            ))}
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
                {requestData.length > 0 ? (
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
                            request.submittedDate || request.created_at
                          ).toLocaleString()}
                        </td>
                        <td className="border px-4 py-2">
                          {request.current_status || "Pending"}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => openViewModal(request._id)}
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

      <div className={`flex-1 p-6 bg-gray-100 transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <div>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="me-2">
                <a
                  onClick={() => setActiveTab("New Request")}
                  className={`inline-block p-4 rounded-t-lg hover:cursor-pointer ${
                    activeTab === "New Request"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
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
                      : "hover:text-gray-600 hover:bg-gray-50"
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
                  <span
                    className="font-semibold cursor-pointer hover:text-blue-500"
                    onClick={handleModalToggle}
                  >
                    Update Bank Name
                  </span>
                  <span className="font-semibold">Update Bank Account</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} handleClose={handleModalToggle} />
      <ViewModal
        isOpen={isViewModalOpen}
        handleClose={closeViewModal}
      />
    </div>
  );
};

export default EmployeeBankRequest;
