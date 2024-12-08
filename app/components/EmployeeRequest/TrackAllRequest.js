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
      {data.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-gray-700 font-medium">No requests to display.</p>
          </div>
        </div>
      )}
      {!loading && data.length > 0 && (
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
              {data.map((request, index) => (
                <tr key={request._id || index}>
                  <td className="border px-4 py-2">
                    {request.requestIdNumber}
                  </td>
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            {/* Previous Button */}
            {requestData.pagination.currentPage > 1 ? (
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  handlePageChange(requestData.pagination.currentPage - 1)
                }
              >
                Previous
              </button>
            ) : (
              <div className="w-24"></div> /* Spacer for alignment */
            )}

            {/* Centered Pagination Info */}
            <span className="text-center">
              Page {requestData.pagination.currentPage} of{" "}
              {requestData.pagination.totalPages}
            </span>

            {/* Next Button */}
            {requestData.pagination.currentPage <
            requestData.pagination.totalPages ? (
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  handlePageChange(requestData.pagination.currentPage + 1)
                }
              >
                Next
              </button>
            ) : (
              <div className="w-24"></div> /* Spacer for alignment */
            )}
          </div>
        </div>
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
