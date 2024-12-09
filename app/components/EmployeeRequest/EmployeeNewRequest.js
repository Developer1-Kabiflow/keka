"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ViewModal from "./ViewModal";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";
import { fetchCategoryList } from "@/app/controllers/categoryController";
import Cookies from "js-cookie";
import SubMenu from "./SubCategory";

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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedSubCategoryId, setSubCategoryId] = useState(null); // Track selected subcategory ID
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
    console.log("Reached here first");
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData("all", employeeId);
      loadRequestData("approved", employeeId);
      loadRequestData("rejected", employeeId);
    }
  }, []);

  const fetchCategoryData = async () => {
    try {
      const { category } = await fetchCategoryList();
      console.log("category-->" + category);
      setCategories(category || []);
    } catch (err) {
      setError(err.message || "Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };
  const handleModalToggle = (itemId) => {
    setSubCategoryId(itemId); // Set the selected subcategory ID
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };
  useEffect(() => {
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
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            {/* Previous Button */}
            {requestData[type].pagination.currentPage > 1 ? (
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  handlePageChange(requestData[type].pagination.currentPage - 1)
                }
              >
                Previous
              </button>
            ) : (
              <div className="w-24"></div> /* Spacer for alignment */
            )}

            {/* Centered Pagination Info */}
            <span className="text-center">
              Page {requestData[type].pagination.currentPage} of{" "}
              {requestData[type].pagination.totalPages}
            </span>

            {/* Next Button */}
            {requestData[type].pagination.currentPage <
            requestData[type].pagination.totalPages ? (
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  handlePageChange(requestData[type].pagination.currentPage + 1)
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
    </>
  );

  const renderContent = () => {
    // if (loading) return <p className="text-center">Loading...</p>;
    // if (error)
    //   return (
    //     <div className="flex justify-center items-center h-full">
    //       <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6">
    //         <p className="text-red-500 font-medium">{error}</p>
    //       </div>
    //     </div>
    //   );

    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-6 bg-gray-50 space-y-4">
            {categories.map((item) => (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-lg border border-gray-200"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev?._id === item._id ? null : item
                    )
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.categoryName}
                  </h3>
                  <span className="text-gray-500">
                    {selectedCategory?._id === item._id ? "−" : "+"}
                  </span>
                </div>
                {selectedCategory && selectedCategory._id === item._id && (
                  <div className="p-4 border-t border-gray-200">
                    <SubMenu
                      categoryId={item._id}
                      handleModalToggle={handleModalToggle}
                      setSubCategoryId={setSubCategoryId}
                      isModalOpen={isModalOpen}
                      selectedSubCategoryId={selectedSubCategoryId}
                    />
                  </div>
                )}
              </div>
            ))}
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
