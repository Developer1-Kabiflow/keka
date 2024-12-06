"use client";

import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

import ViewModal from "./ViewModal";

import { fetchAllEmployeeRequests } from "@/app/controllers/requestController";

const TrackAllRequest = () => {
  const [requestData, setRequestData] = useState({
    data: [],
    pagination: { currentPage: 1, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const loadRequestData = async (employeeId, page = 1) => {
    try {
      setLoading(true);
      const { Allrequests, pagination } = await fetchAllEmployeeRequests(
        employeeId,
        page
      );

      setRequestData({
        data: Allrequests || [],
        pagination: {
          currentPage: pagination?.[1] || 1,
          totalPages: pagination?.[0] || 1,
        },
      });
    } catch (err) {
      console.error("Error fetching request data:", err);
      setError("Error fetching request data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the employee requests
  useEffect(() => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId);
    }
  }, []);

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };

  const handlePageChange = (newPage) => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId, newPage);
    }
  };

  const { data, pagination } = requestData;

  return (
    <div className="p-4 bg-white overflow-auto">
      {loading && <div>Loading...</div>}
      {error && (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
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
              {data.length === 0 ? (
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
              ) : (
                data.map((request, index) => (
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
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {isViewModalOpen && (
        <ViewModal
          isOpen={isViewModalOpen}
          handleClose={closeViewModal}
          requestId={selectedRequestId}
        />
      )}
    </div>
  );
};

export default TrackAllRequest;
