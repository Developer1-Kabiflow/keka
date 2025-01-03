"use client";
import React, { useState } from "react";

const RequestTable = ({
  data = [],
  loading,
  handleViewModal,
  pagination,
  handlePageChange,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const handlePageClick = async (page) => {
    setIsFetching(true);
    await handlePageChange(page);
    setIsFetching(false);
  };

  const renderTableRows = () => {
    if (loading) {
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

    if (!data || data.length === 0) {
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
        <td className="border px-4 py-2">
          {request.request_name || request.subTaskName || "N/A"}
        </td>
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
            request.status === "Approved" || request.status === "Completed"
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

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;

    const getPages = () => {
      const pages = [];
      const maxVisiblePages = 5; // Number of pages to show around the current page
      const ellipsis = "...";

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, ellipsis, totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, ellipsis, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(
            1,
            ellipsis,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            ellipsis,
            totalPages
          );
        }
      }

      return pages;
    };

    return (
      <div className="flex justify-center items-center mt-6">
        <div className="flex space-x-2">
          {currentPage > 1 && (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              onClick={() => handlePageClick(currentPage - 1)}
            >
              Previous
            </button>
          )}
          {getPages().map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`px-3 py-2 rounded-lg transition duration-200 ${
                  page === currentPage
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-3 py-2 text-gray-500 font-medium">
                {page}
              </span>
            )
          )}
          {currentPage < totalPages && (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
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

      {!loading && (data.length > 0 || isFetching) && renderPagination()}
    </div>
  );
};

export default RequestTable;
