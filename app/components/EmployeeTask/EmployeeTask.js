"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import RequestTable from "../utils/RequestTable";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  fetchAll,
  fetchCompleted,
  fetchPending,
} from "@/app/controllers/taskController";
import Modal from "./Modal";

const EmployeeTask = () => {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [taskData, setTaskData] = useState({
    all: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    approved: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    pending: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    rejected: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
  });
  const tabs = useMemo(
    () => [
      { key: "All Tasks", label: "All Tasks" },
      { key: "Completed Tasks", label: "Completed Tasks" },
      { key: "Pending Tasks", label: "Pending Tasks" },
    ],
    []
  );
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [error, setError] = useState(null); // Initialize error state
  useEffect(() => {
    console.log("requestId from cookie " + requestId);
    if (requestId) {
      setSelectedRequestId(requestId);
      setIsModalOpen(true);
    }
  }, [requestId]);
  const openModal = (requestId, isPending) => {
    setShowSubmit(isPending);
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
    const query = new URLSearchParams(window.location.search);
    query.set("requestId", requestId);
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
      loadTaskData(type, approverId, newPage);
    }
  };

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const loadTaskData = useCallback(async (type, approverId, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      let response;
      switch (type) {
        case "all":
          response = await fetchAll(approverId, page);
          break;
        case "completed":
          response = await fetchCompleted(approverId, page);
          break;
        case "pending":
          response = await fetchPending(approverId, page);
          break;
        default:
          return;
      }
      const {
        Allrequests = [],
        Completedrequests = [],
        Pendingrequests = [],
        pagination = { currentPage: 1, totalPages: 1 },
      } = response || {};

      setTaskData((prevState) => ({
        ...prevState,
        [type]: {
          data:
            type === "pending"
              ? Pendingrequests
              : type === "completed"
              ? Completedrequests
              : Allrequests,
          pagination: {
            currentPage: pagination?.[1] || 1,
            totalPages: pagination?.[0] || 1,
          },
        },
      }));
    } catch (err) {
      console.error("Error fetching task data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const approverId = Cookies.get("userId");
    if (approverId) {
      loadTaskData("all", approverId);
      loadTaskData("completed", approverId);
      loadTaskData("pending", approverId);
    }
  }, [loadTaskData]);

  const refreshData = () => {
    const approverId = Cookies.get("userId");
    loadTaskData("all", approverId);
    loadTaskData("completed", approverId);
    loadTaskData("pending", approverId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "All Tasks":
        return (
          <RequestTable
            data={taskData.all.data}
            loading={loading}
            pagination={taskData.all.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("all", page)}
          />
        );
      case "Pending Tasks":
        return (
          <RequestTable
            data={taskData.pending.data}
            loading={loading}
            pagination={taskData.pending.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("pending", page)}
          />
        );
      case "Completed Tasks":
        return (
          <RequestTable
            data={taskData.completed.data}
            loading={loading}
            pagination={taskData.approved.pagination}
            handleViewModal={openModal}
            handlePageChange={(page) => handlePageChange("approved", page)}
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
        {renderContent()}
      </div>
      {/* Modal Component */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          handleClose={closeModal}
          requestId={selectedRequestId}
          showSubmit={showSubmit}
          onToast={handleToast}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default EmployeeTask;
