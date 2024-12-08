"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchApproved } from "@/app/controllers/approvalController";
import Cookies from "js-cookie";
import ViewModal from "./ViewModal";
import { toast } from "react-toastify";

const TrackApprovedByMe = () => {
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
  console.log(" requestData.data.length-->" + requestData.data.length);
  const fetchRequestData = useCallback(async (approverId, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchApproved(approverId, page);
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
      {loading && (
        <></>
        // <div className="p-4 bg-white overflow-auto">
        //   <table className="table-auto w-full text-left">
        //     <thead className="bg-gray-200">
        //       <tr>
        //         <th className="px-4 py-2">No.</th>
        //         <th className="px-4 py-2">Request Type</th>
        //         <th className="px-4 py-2">Request Date</th>
        //         <th className="px-4 py-2">Status</th>
        //         <th className="px-4 py-2">Action</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {/* Skeleton Rows */}
        //       {Array.from({ length: 5 }).map((_, index) => (
        //         <tr key={index} className="animate-pulse">
        //           <td className="border px-4 py-2">
        //             <div className="h-4 bg-gray-300 rounded"></div>
        //           </td>
        //           <td className="border px-4 py-2">
        //             <div className="h-4 bg-gray-300 rounded"></div>
        //           </td>
        //           <td className="border px-4 py-2">
        //             <div className="h-4 bg-gray-300 rounded"></div>
        //           </td>
        //           <td className="border px-4 py-2">
        //             <div className="h-4 bg-gray-300 rounded"></div>
        //           </td>
        //           <td className="border px-4 py-2">
        //             <div className="h-4 bg-gray-300 rounded"></div>
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
      )}
      {requestData.data.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-gray-700 font-medium">No requests to display.</p>
          </div>
        </div>
      )}
      {!loading && requestData.data.length > 0 && (
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
              {requestData.data
                .slice()
                .reverse()
                .map((request, index) => (
                  <tr key={request.request_id || index}>
                    <td className="border px-4 py-2">
                      {request.requestIdNumber}
                    </td>
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
                ))}
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

export default TrackApprovedByMe;
