import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import ViewModal from "./ViewModal";
import { fetchApprovedEmployeeRequests } from "@/app/controllers/requestController";

const TrackApprovedRequest = () => {
  const [requestData, setRequestData] = useState({
    data: [],
    pagination: { currentPage: 1, totalPages: 1 },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const employeeId = Cookies.get("userId");

  const fetchRequestData = useCallback(async (employeeId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { Approvedrequests, pagination } =
        await fetchApprovedEmployeeRequests(employeeId, page);
      setRequestData({
        data: Approvedrequests,
        pagination: {
          currentPage: pagination?.[1] || 1,
          totalPages: pagination?.[0] || 1,
        },
      });
    } catch (err) {
      setError("Failed to fetch approved requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchRequestData(employeeId);
    }
  }, [fetchRequestData, employeeId]);

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };

  const handlePageChange = (newPage) => {
    fetchRequestData(employeeId, newPage);
  };

  return (
    <>
      {loading && (
        <></>
        // <div className="p-4 bg-white overflow-auto">
        //   <div className="p-4 bg-white overflow-auto">
        //     <table className="table-auto w-full text-left">
        //       <thead className="bg-gray-200">
        //         <tr>
        //           <th className="px-4 py-2">No.</th>
        //           <th className="px-4 py-2">Request Type</th>
        //           <th className="px-4 py-2">Request Date</th>
        //           <th className="px-4 py-2">Status</th>
        //           <th className="px-4 py-2">Action</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         {/* Skeleton Rows */}
        //         {Array.from({ length: 5 }).map((_, index) => (
        //           <tr key={index} className="animate-pulse">
        //             <td className="border px-4 py-2">
        //               <div className="h-4 bg-gray-300 rounded"></div>
        //             </td>
        //             <td className="border px-4 py-2">
        //               <div className="h-4 bg-gray-300 rounded"></div>
        //             </td>
        //             <td className="border px-4 py-2">
        //               <div className="h-4 bg-gray-300 rounded"></div>
        //             </td>
        //             <td className="border px-4 py-2">
        //               <div className="h-4 bg-gray-300 rounded"></div>
        //             </td>
        //             <td className="border px-4 py-2">
        //               <div className="h-4 bg-gray-300 rounded"></div>
        //             </td>
        //           </tr>
        //         ))}
        //       </tbody>
        //     </table>
        //   </div>
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
              {requestData.data.map((request, index) => (
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
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={requestData[type].pagination.currentPage === 1}
              onClick={() =>
                handlePageChange(
                  type,
                  requestData[type].pagination.currentPage - 1
                )
              }
            >
              Previous
            </button>
            <span>
              Page {requestData[type].pagination.currentPage} of{" "}
              {requestData[type].pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={
                requestData[type].pagination.currentPage ===
                requestData[type].pagination.totalPages
              }
              onClick={() =>
                handlePageChange(
                  type,
                  requestData[type].pagination.currentPage + 1
                )
              }
            >
              Next
            </button>
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
    </>
  );
};

export default TrackApprovedRequest;
