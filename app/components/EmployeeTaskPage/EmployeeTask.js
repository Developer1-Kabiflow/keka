"use client";

import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";
import {
  fetchAll,
  fetchApproved,
  fetchPending,
  fetchRejected,
} from "@/app/controllers/approvalController";

const EmployeeTask = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Requests");
  const [requestData, setRequestData] = useState({
    all: [],
    approved: [],
    rejected: [],
    pending: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAcceptReject, setShowAcceptReject] = useState(false);
  const fetchRequestData = async (approverId) => {
    try {
      const responses = await Promise.all([
        fetchAll(approverId),
        fetchApproved(approverId),
        fetchRejected(approverId),
        fetchPending(approverId),
      ]);

      const newRequestData = {
        all: responses[0].Allrequests || [],
        approved: responses[1].Approvedrequests || [],
        rejected: responses[2].Rejectedrequests || [],
        pending: responses[3].PendingRequests || [],
      };

      console.log("Fetched data:", newRequestData); // Check if data is updated correctly

      setRequestData(newRequestData); // Update the state
    } catch (error) {
      console.error("Error fetching request data:", error);
      setError("Failed to load request data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const approverId = "E001";
    fetchRequestData(approverId);
  }, []);

  const openModal = (requestId, isPending) => {
    console.log("inside openModal-->" + isPending);
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
    setShowAcceptReject(isPending);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };
  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };
  const refreshData = () => {
    // Trigger data refresh after approval/rejection
    fetchRequestData("E001");
  };
  const RequestTable = ({ requests }) => {
    console.log("Rendering RequestTable with requests:", requests);

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
            {Array.isArray(requests) && requests.length > 0 ? (
              requests.map((request, index) => (
                <tr key={request.request_id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {request.request_name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {request.request_raised_time
                      ? new Date(request.request_raised_time).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {request.status || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        openModal(
                          request.request_id,
                          request.status === "In-progress"
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No Task Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    switch (activeTab) {
      case "Pending for Approval":
        return <RequestTable requests={requestData.pending} />;
      case "Approved by Me":
        return <RequestTable requests={requestData.approved} />;
      case "Rejected by Me":
        return <RequestTable requests={requestData.rejected} />;
      case "All Requests":
        return <RequestTable requests={requestData.all} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden p-4"
        aria-label="Toggle Sidebar"
      >
        <div className="w-8 h-1 bg-blue-600 mb-1" />
        <div className="w-8 h-1 bg-blue-600 mb-1" />
        <div className="w-8 h-1 bg-blue-600" />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-75 md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <EmployeeSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <ul className="flex text-sm font-medium text-gray-500 border-b">
          {[
            "All Requests",
            "Pending for Approval",
            "Approved by Me",
            "Rejected by Me",
          ].map((tab) => (
            <li key={tab} className="mr-2">
              <button
                className={`p-4 rounded-t-lg ${
                  activeTab === tab
                    ? "text-blue-600 bg-white"
                    : "hover:text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
        <div>{renderContent()}</div>
      </div>

      {isModalOpen && (
        <ViewModal
          isOpen={isModalOpen}
          handleClose={closeModal}
          requestId={selectedRequestId}
          showAcceptReject={showAcceptReject}
          onToast={handleToast}
          refreshData={refreshData} // Pass the refreshData callback
        />
      )}
    </div>
  );
};

export default EmployeeTask;
