"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import RequestTable from "../utils/RequestTable";
import {
  fetchAll,
  fetchApproved,
  fetchPending,
  fetchRejected,
} from "@/app/controllers/approvalController";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import ViewModal from "./ViewModal";
const EmployeeApproval = () => {
  const [activeTab, setActiveTab] = useState("All Requests");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showAcceptReject, setShowAcceptReject] = useState(false);
  const [requestData, setRequestData] = useState({
    all: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    approved: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    pending: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    rejected: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
  });
  const tabs = useMemo(
    () => [
      { key: "All Requests", label: "All Requests" },
      { key: "Pending for Approval", label: "My Pending Approvals" },
      { key: "Approved by Me", label: "Approved by Me" },
      { key: "Rejected by Me", label: "Rejected by Me" },
    ],
    []
  );
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [error, setError] = useState(null);
  useEffect(() => {
    if (requestId) {
      setSelectedRequestId(requestId);
      setIsModalOpen(true);
    }
  }, [requestId]);
  const openModal = (requestId, isPending) => {
    setShowAcceptReject(isPending);
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
    const query = new URLSearchParams(window.location.search);
    query.set("requestId", requestId); // Add or update requestId
    // query.set("formTemplateId", formTemplateId); // Add or update formTemplateId

    // Update the URL without reloading the page
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}?${query.toString()}`
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
    const query = new URLSearchParams(window.location.search);
    query.delete("requestId");
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}?${query.toString()}`
    );
  };

  const handlePageChange = (type, newPage) => {
    const approverId = Cookies.get("userId");
    if (approverId) {
      loadRequestData(type, approverId, newPage);
    }
  };

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const loadRequestData = useCallback(async (type, approverId, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Determine which controller method to call
      let response;
      switch (type) {
        case "all":
          response = await fetchAll(approverId, page);
          break;
        case "approved":
          response = await fetchApproved(approverId, page);
          break;
        case "pending":
          response = await fetchPending(approverId, page);
          break;
        case "rejected":
          response = await fetchRejected(approverId, page);
          break;
        default:
          throw new Error("Invalid request type");
      }

      const {
        Allrequests = [],
        Approvedrequests = [],
        Rejectedrequests = [],
        Pendingrequests = [],
        pagination = { currentPage: 1, totalPages: 1 },
      } = response || {};

      setRequestData((prevState) => ({
        ...prevState,
        [type]: {
          data:
            type === "all"
              ? Allrequests
              : type === "approved"
              ? Approvedrequests
              : type === "pending"
              ? Pendingrequests
              : Rejectedrequests,
          pagination: {
            currentPage: pagination?.[1] || 1,
            totalPages: pagination?.[0] || 1,
          },
        },
      }));
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const approverId = Cookies.get("userId");
    if (approverId) {
      loadRequestData("all", approverId);
      loadRequestData("approved", approverId);
      loadRequestData("pending", approverId);
      loadRequestData("rejected", approverId);
    }
  }, [loadRequestData]); // Correct dependency to avoid unnecessary re-renders

  const refreshData = () => {
    const approverId = Cookies.get("userId");
    loadRequestData("all", approverId);
    loadRequestData("approved", approverId);
    loadRequestData("pending", approverId);
    loadRequestData("rejected", approverId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "All Requests":
        return (
          <RequestTable
            data={requestData.all.data}
            loading={loading}
            pagination={requestData.all.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("all", page)}
          />
        );
      case "Pending for Approval":
        return (
          <RequestTable
            data={requestData.pending.data}
            loading={loading}
            pagination={requestData.pending.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("pending", page)}
          />
        );
      case "Approved by Me":
        return (
          <RequestTable
            data={requestData.approved.data}
            loading={loading}
            pagination={requestData.approved.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("approved", page)}
          />
        );
      case "Rejected by Me":
        return (
          <RequestTable
            data={requestData.rejected.data}
            loading={loading}
            pagination={requestData.rejected.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("rejected", page)}
          />
        );
      default:
        return <div>Invalid Tab</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-6 bg-gray-100">
        <ul className="flex text-sm font-medium text-gray-500 border-b">
          {tabs.map((tab) => (
            <li key={tab.key} className="mr-2">
              <button
                className={`p-4 rounded-t-lg text-sm ${
                  activeTab === tab.key
                    ? "text-blue-600 font-bold bg-white"
                    : "hover:text-gray-600 hover:bg-gray-50"
                } `}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        {error && (
          <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-3 mb-4 rounded-md">
            <span>{error}</span>
          </div>
        )}
        {renderContent()}
      </div>
      {/* Modal Component */}
      {isModalOpen && (
        <ViewModal
          isOpen={isModalOpen}
          handleClose={closeModal}
          requestId={selectedRequestId}
          showAcceptReject={showAcceptReject}
          onToast={handleToast}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default EmployeeApproval;
