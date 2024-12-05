"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchAll } from "@/app/controllers/approvalController";
import Cookies from "js-cookie";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";

const TrackPendingRequest = () => {
  const [requestData, setRequestData] = useState({
    data: [],
    pagination: { currentPage: 1, totalPages: 1 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showAcceptReject, setShowAcceptReject] = useState(false);

  const approverId = Cookies.get("userId");
  const fetchRequestData = useCallback(async (approverId, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAll(approverId, page);
      const parsedData = Array.isArray(response.data[0])
        ? response.data[0]
        : response.data || [];

      setRequestData({
        data: parsedData,
        pagination: {
          currentPage: response.pagination?.[1] || 1,
          totalPages: response.pagination?.[0] || 1,
        },
      });
    } catch (err) {
      console.error("Error fetching approved requests:", err);
      setError("Failed to fetch approved requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
 
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

  const handlePageChange = (newPage) => {
   
    fetchRequestData(approverId, newPage);
  };

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const refreshData = () => {
  
    fetchRequestData(
      approverId,
      requestData[activeTab]?.pagination?.currentPage || 1
    );
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
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
                requestData.data
                  .slice()
                  .reverse()
                  .map((request, index) => (
                    <tr key={request.request_id || index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {request.request_name || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {request.request_raised_time
                          ? new Date(
                              request.request_raised_time
                            ).toLocaleString()
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
                    No Pending Requests Found.
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
              showAcceptReject={showAcceptReject}
              onToast={handleToast}
              refreshData={refreshData} // Pass the refreshData callback
            />
          )}
    </div>
  );
};

export default TrackPendingRequest;
