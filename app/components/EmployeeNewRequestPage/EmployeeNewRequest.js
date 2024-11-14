"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import BASE_URL from "@/utils/utils";
import EmployeeSidebar from "../../components/EmployeeSidebarPage/EmployeeSidebar";
import ViewModal from "../../components/EmployeeBankRequestPage/ViewModal";

const EmployeeNewRequest = ({ requests, formTemplates }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requestData, setRequestData] = useState(requests || []);
  const [formTemplateData, setFormTemplateData] = useState(formTemplates || []);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [links] = useState([
    { text: "Bank", path: "/employee/bankRequest" },
    { text: "Address", path: "/employee/bankRequest" },
    { text: "Payment", path: "/employee/bankRequest" },
    { text: "Leave", path: "/employee/bankRequest" },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white w-[100%]">
            {links.map((link, index) => (
              <Link key={index} href={link.path}>
                <a className="font-semibold">
                  <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 mb-2 ">
                    {link.text}
                  </p>
                </a>
              </Link>
            ))}
          </div>
        );
      case "Track Request":
        return (
          <div className="p-4 bg-white">
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
                          {new Date(request.submittedDate || request.created_at).toLocaleString()}
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
          className={`h-1 w-8 bg-blue-600 mb-1 transition-transform ${isSidebarOpen ? "rotate-45" : ""}`}
        />
        <div className={`h-1 w-8 bg-blue-600 mb-1 ${isSidebarOpen ? "opacity-0" : ""}`} />
        <div
          className={`h-1 w-8 bg-blue-600 mt-1 transition-transform ${isSidebarOpen ? "-rotate-45" : ""}`}
        />
      </button>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-gray-800 bg-opacity-75 ${isSidebarOpen ? "block" : "hidden"}`}
      >
        <EmployeeSidebar closeSidebar={toggleSidebar} />
      </div>

      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${isSidebarOpen ? "ml-0" : "md:ml-0"}`}
      >
        <div className="container mx-auto px-4">
          <div>
            {/* Tab navigation */}
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("New Request")}
                  className={`inline-block p-4 rounded-t-lg ${activeTab === "New Request" ? "text-blue-600 bg-white" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"}`}
                >
                  New Request
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("Track Request")}
                  className={`inline-block p-4 rounded-t-lg ${activeTab === "Track Request" ? "text-blue-600 bg-white" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"}`}
                >
                  Track Request
                </a>
              </li>
            </ul>

            {/* Content area */}
            <div className="flex bg-white shadow-lg mt-4 rounded-lg justify-between">
              <div className="w-full">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
      <ViewModal isOpen={isViewModalOpen} handleClose={closeViewModal} task={selectedTask} />
    </div>
  );
};


export async function getServerSideProps() {
  const employeeId = "12345"; 
  try {
    const response = await axios.get(`${BASE_URL}/trackRequest/myRequest/${employeeId}`);
    const { requests, formTemplates } = response.data;
    return { props: { requests, formTemplates } };
  } catch (error) {
    console.error("Error fetching request data:", error);
    return { props: { requests: [], formTemplates: [] } };
  }
}

export default EmployeeNewRequest;
