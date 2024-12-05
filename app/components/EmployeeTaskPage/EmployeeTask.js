"use client";

import React, { useEffect, useState, useCallback } from "react";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";
import {
  fetchAll,
  fetchApproved,
  fetchPending,
  fetchRejected,
} from "@/app/controllers/approvalController";

import Cookies from "js-cookie";

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

  const fetchRequestData = useCallback(async (approverId) => {
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

      console.log("Fetched data:", newRequestData);
      setRequestData(newRequestData);
    } catch (error) {
      console.error("Error fetching request data:", error);
      setError("There is no request to display");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const approverId = Cookies.get("userId");
    fetchRequestData(approverId);
  }, [fetchRequestData]);

  const openModal = (requestId, isPending) => {
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
    fetchRequestData("E001");
  };

  const RequestTable = ({ requests }) => {
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
              [...requests].reverse().map((request, index) => (
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
     if (error || !requestData.all.length) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-gray-700 font-medium">No requests to display.</p>
          </div>
        </div>
      );
    }


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
      {/* Main content */}
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

      {/* Modal */}
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
