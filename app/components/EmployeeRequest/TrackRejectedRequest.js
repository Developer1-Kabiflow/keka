"use client";

import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import ViewModal from "./ViewModal";
import { fetchRejectedEmployeeRequests } from "@/app/controllers/requestController";

const TrackRejectedRequest = () => {
  const [requestData, setRequestData] = useState({
    data: [],
    pagination: { currentPage: 1, totalPages: 1 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const employeeId = Cookies.get("userId");

  const fetchRequestData = useCallback(async (employeeId, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { Rejectedrequests, pagination } =
        await fetchRejectedEmployeeRequests(employeeId, page);
      setRequestData({
        data: Rejectedrequests,
        pagination: {
          currentPage: pagination?.[1] || 1,
          totalPages: pagination?.[0] || 1,
        },
      });
    } catch (err) {
      setError("Failed to fetch rejected requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchRequestData(employeeId);
    }
  }, [fetchRequestData, employeeId]);

  const openModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  const handlePageChange = (newPage) => {
    fetchRequestData(employeeId, newPage);
  };

  return (
    <div>
      {loading && (
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
              {/* Skeleton Rows */}
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      )}
      {!loading && !error && (
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
              {requestData.data.length > 0 ? (
                requestData.data.map((request, index) => (
                  <tr key={request._id || index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {request.request_name || "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(
                        request.date || request.created_at
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      {request.status || "Rejected"}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => openModal(request.request_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="flex justify-center items-center h-full">
                      <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
                        <p className="text-gray-700 font-medium">
                          No Requests found
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={requestData.pagination.currentPage === 1}
              onClick={() =>
                handlePageChange(requestData.pagination.currentPage - 1)
              }
            >
              Previous
            </button>
            <span>
              Page {requestData.pagination.currentPage} of{" "}
              {requestData.pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={
                requestData.pagination.currentPage ===
                requestData.pagination.totalPages
              }
              onClick={() =>
                handlePageChange(requestData.pagination.currentPage + 1)
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Modal Component */}
      {isModalOpen && (
        <ViewModal
          isOpen={isModalOpen}
          handleClose={closeModal}
          requestId={selectedRequestId}
        />
      )}
    </div>
  );
};

export default TrackRejectedRequest;
