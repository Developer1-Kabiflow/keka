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
    completed: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    pending: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
  });

  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [error, setError] = useState(null);
  const tabs = useMemo(
    () => [
      { key: "All Tasks", label: "All Tasks" },
      { key: "Completed Tasks", label: "Completed Tasks" },
      { key: "Pending Tasks", label: "Pending Tasks" },
    ],
    []
  );

  const handleToast = useCallback((message, type) => {
    type === "success" ? toast.success(message) : toast.error(message);
  }, []);

  const loadTaskData = useCallback(
    async (type, approverId, page = 1) => {
      try {
        setLoading(true);
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
            throw new Error("Invalid task type");
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
        setError(
          err.message ||
            "An error occurred while fetching data. Please try again later."
        ); // Set error message
        handleToast("Failed to load data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [handleToast]
  );

  const refreshData = useCallback(() => {
    const approverId = Cookies.get("userId");
    if (approverId) {
      loadTaskData("all", approverId);
      loadTaskData("completed", approverId);
      loadTaskData("pending", approverId);
    }
  }, [loadTaskData]);

  useEffect(() => {
    const approverId = Cookies.get("userId");
    if (approverId) refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (requestId) {
      setSelectedRequestId(requestId);
      refreshData();
      setIsModalOpen(true);
    }
  }, [requestId, refreshData]);

  const openModal = useCallback((requestId, isPending) => {
    setShowSubmit(isPending);
    setSelectedRequestId(requestId);
    setIsModalOpen(true);

    const query = new URLSearchParams(window.location.search);
    query.set("requestId", requestId);
    window.history.pushState(null, "", `${window.location.pathname}?${query}`);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRequestId(null);

    const query = new URLSearchParams(window.location.search);
    query.delete("requestId");
    window.history.pushState(null, "", `${window.location.pathname}?${query}`);
  }, []);

  const handlePageChange = useCallback(
    (type, newPage) => {
      const approverId = Cookies.get("userId");
      if (approverId) loadTaskData(type, approverId, newPage);
    },
    [loadTaskData]
  );

  const renderContent = useCallback(() => {
    const tableProps = {
      loading,
      handleViewModal: openModal,
    };

    switch (activeTab) {
      case "All Tasks":
        return (
          <RequestTable
            {...tableProps}
            data={taskData.all.data}
            pagination={taskData.all.pagination}
            handlePageChange={(page) => handlePageChange("all", page)}
          />
        );
      case "Pending Tasks":
        return (
          <RequestTable
            {...tableProps}
            data={taskData.pending.data}
            pagination={taskData.pending.pagination}
            handlePageChange={(page) => handlePageChange("pending", page)}
          />
        );
      case "Completed Tasks":
        return (
          <RequestTable
            {...tableProps}
            data={taskData.completed.data}
            pagination={taskData.completed.pagination}
            handlePageChange={(page) => handlePageChange("completed", page)}
          />
        );
      default:
        return <div>Invalid Tab</div>;
    }
  }, [activeTab, taskData, loading, openModal, handlePageChange]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-6 bg-gray-100">
        {error && (
          <div className="text-red-500 bg-red-100 p-4 mb-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        <ul className="flex text-sm font-medium text-gray-500 border-b">
          {tabs.map((tab) => (
            <li key={tab.key} className="mr-2">
              <button
                className={`p-4 rounded-t-lg text-sm ${
                  activeTab === tab.key
                    ? "text-blue-600 font-bold bg-white"
                    : "hover:text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        {renderContent()}
      </div>
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
