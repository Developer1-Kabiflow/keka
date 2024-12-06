"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ViewModal from "../EmployeeRequest/ViewModal";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";
import { fetchCategoryList } from "@/app/controllers/categoryController";
import Cookies from "js-cookie";

const EmployeeNewRequest = () => {
  const [requestData, setRequestData] = useState({
    all: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    approved: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    rejected: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
  });
  const [formTemplateData, setFormTemplateData] = useState([]);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New Request");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const tabs = useMemo(
    () => [
      { key: "New Request", label: "New Request" },
      { key: "Track All Request", label: "Track All Requests" },
      { key: "Track Approved Requests", label: "Approved Requests" },
      { key: "Track Rejected Requests", label: "Rejected Requests" },
    ],
    []
  );

  const loadRequestData = async (type, employeeId, page = 1) => {
    try {
      setLoading(true);
      let response;
      switch (type) {
        case "all":
          response = await fetchAllEmployeeRequests(employeeId, page);
          break;
        case "approved":
          response = await fetchApprovedEmployeeRequests(employeeId, page);
          break;
        case "rejected":
          response = await fetchRejectedEmployeeRequests(employeeId, page);
          break;
        default:
          return;
      }

      const {
        Allrequests = [],
        Approvedrequests = [],
        Rejectedrequests = [],
        pagination,
      } = response;

      setRequestData((prevState) => ({
        ...prevState,
        [type]: {
          data:
            type === "all"
              ? Allrequests
              : type === "approved"
              ? Approvedrequests
              : Rejectedrequests,
          pagination: {
            currentPage: pagination?.[1] || 1,
            totalPages: pagination?.[0] || 1,
          },
        },
      }));
    } catch (err) {
      setError("Error fetching request data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData("all", employeeId);
      loadRequestData("approved", employeeId);
      loadRequestData("rejected", employeeId);
    }
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryList = await fetchCategoryList();
        setCategory(categoryList.category);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };

  const handlePageChange = (type, newPage) => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(type, employeeId, newPage);
    }
  };

  const renderTable = (data, type) => (
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

  const renderContent = () => {
    if (loading) return <p className="text-center">Loading...</p>;
    if (error)
      return (
        <div className="flex justify-center items-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      );

    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-4 bg-white w-full">
            {category.length > 0 ? (
              category.map((item) => (
                <Link key={item._id} href={`${item.pageLink}/${item._id}`}>
                  <p className="bg-green-100 p-2 rounded-md hover:bg-green-200 cursor-pointer mb-2">
                    {item.categoryName}
                  </p>
                </Link>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        );
      case "Track All Request":
        return renderTable(requestData.all.data, "all");
      case "Track Approved Requests":
        return renderTable(requestData.approved.data, "approved");
      case "Track Rejected Requests":
        return renderTable(requestData.rejected.data, "rejected");
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-6 bg-gray-100">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`inline-block p-4 ${
                  activeTab === tab.key
                    ? "text-blue-600 font-bold bg-white"
                    : "hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default EmployeeNewRequest;
