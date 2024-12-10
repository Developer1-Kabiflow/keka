"use client";
import React, { useState } from "react";
import { format } from "date-fns";

const RequestTable = ({
  data = [],
  loading,
  handleViewModal,
  pagination,
  handlePageChange,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  // Wrapper for handlePageChange to manage the fetching state
  const handlePageClick = async (page) => {
    setIsFetching(true);
    await handlePageChange(page); // Call the actual function
    setIsFetching(false);
  };

  const renderTableRows = () => {
    if (isFetching) {
      return Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="border px-4 py-2 bg-gray-200">&nbsp;</td>
          <td className="border px-4 py-2 bg-gray-200">&nbsp;</td>
          <td className="border px-4 py-2 bg-gray-200">&nbsp;</td>
          <td className="border px-4 py-2 bg-gray-200">&nbsp;</td>
          <td className="border px-4 py-2 bg-gray-200">&nbsp;</td>
        </tr>
      ));
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center py-6">
            <p className="text-gray-700 font-medium">No requests to display.</p>
          </td>
        </tr>
      );
    }

    return data.map((request, index) => (
      <tr key={request._id || index} className="hover:bg-gray-100">
        <td className="border px-4 py-2">{request.requestIdNumber}</td>
        <td className="border px-4 py-2">{request.request_name || "N/A"}</td>
        <td className="border px-4 py-2">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(request.request_raised_time || request.date))}
        </td>
        <td
          className={`border px-4 py-2 ${
            request.status === "Approved"
              ? "text-green-600 font-semibold"
              : request.status === "Rejected"
              ? "text-red-600 font-semibold"
              : request.status === "In-progress"
              ? "text-orange-600 font-semibold"
              : "text-black"
          }`}
        >
          {request.status || "Pending"}
        </td>
        <td className="border px-4 py-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() =>
              handleViewModal(
                request.request_id,
                request.status === "In-progress"
              )
            }
          >
            View
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4 bg-white overflow-auto">
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">No.</th>
            <th className="px-4 py-2 border">Request Type</th>
            <th className="px-4 py-2 border">Request Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      {/* Pagination */}
      {!loading && (data.length > 0 || isFetching) && (
        <div className="flex justify-center items-center mt-6">
          <div className="flex space-x-2">
            {pagination.currentPage > 1 && (
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={() => handlePageClick(pagination.currentPage - 1)}
              >
                Previous
              </button>
            )}
            {Array.from(
              { length: pagination.totalPages },
              (_, pageIndex) => pageIndex + 1
            ).map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-lg transition duration-200 ${
                  page === pagination.currentPage
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ))}
            {pagination.currentPage < pagination.totalPages && (
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={() => handlePageClick(pagination.currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTable;
