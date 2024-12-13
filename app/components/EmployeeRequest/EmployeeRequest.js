"use client";
import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import ViewModal from "./ViewModal";
import {
  fetchAllEmployeeRequests,
  fetchApprovedEmployeeRequests,
  fetchRejectedEmployeeRequests,
} from "@/app/controllers/requestController";
import RequestTable from "../utils/RequestTable"; // Import the RequestTable component
import SubMenu from "./SubCategory"; // Import SubMenu component (if you need it)
import { fetchCategoryList } from "@/app/controllers/categoryController";

const EmployeeNewRequest = () => {
  const [activeTab, setActiveTab] = useState("New Request"); // Initialize the activeTab state
  const [requestData, setRequestData] = useState({
    all: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    approved: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
    rejected: { data: [], pagination: { currentPage: 1, totalPages: 1 } },
  });
  const [loading, setLoading] = useState(false); // Adjusted loading state
  const [error, setError] = useState(null); // Error state to capture any errors
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedSubCategoryId, setSubCategoryId] = useState(null); // Track selected subcategory ID
  const [categoryLoading, setCategoryLoading] = useState(false); // State to track category loading

  const loadRequestData = async (type, employeeId, page = 1) => {
    try {
      setLoading(true);
      setError(null); // Reset error state before fetching data
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

      const { Allrequests, Approvedrequests, Rejectedrequests, pagination } =
        response;

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
      if (err.message !== "No requests found for this user") {
        setError("Failed to load data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    try {
      setLoading(true); // Set loading to true when refreshing
      const employeeId = Cookies.get("userId");
      if (employeeId) {
        await loadRequestData("all", employeeId);
        await loadRequestData("approved", employeeId);
        await loadRequestData("rejected", employeeId);
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
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

  const fetchCategoryData = async () => {
    setCategoryLoading(true); // Start category loading
    try {
      const { category } = await fetchCategoryList();
      console.log("category-->" + category);
      setCategories(category || []);
    } catch (err) {
      setError(err.message || "Error fetching categories.");
    } finally {
      setCategoryLoading(false); // Stop category loading
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

  const tabs = useMemo(
    () => [
      { key: "New Request", label: "New Request" },
      { key: "Track All Request", label: "Track All Requests" },
      { key: "Track Approved Requests", label: "Approved Requests" },
      { key: "Track Rejected Requests", label: "Rejected Requests" },
    ],
    []
  );

  const renderContent = () => {
    switch (activeTab) {
      case "New Request":
        return (
          <div className="p-6 bg-gray-50 space-y-4">
            {categoryLoading ? (
              <div className="space-y-4">
                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-500 font-semibold">
                No categories available at the moment.
              </div>
            ) : (
              categories.map((item) => (
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
                        refreshData={refreshData}
                        selectedSubCategoryId={selectedSubCategoryId}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );
      case "Track All Request":
        return (
          <RequestTable
            data={requestData.all.data}
            loading={loading}
            pagination={requestData.all.pagination}
            handleViewModal={openViewModal}
            handlePageChange={(page) => handlePageChange("all", page)}
          />
        );
      case "Track Approved Requests":
        return (
          <RequestTable
            data={requestData.approved.data}
            loading={loading}
            pagination={requestData.approved.pagination}
            handleViewModal={openViewModal}
            handlePageChange={(page) => handlePageChange("approved", page)}
          />
        );
      case "Track Rejected Requests":
        return (
          <RequestTable
            data={requestData.rejected.data}
            loading={loading}
            pagination={requestData.rejected.pagination}
            handleViewModal={openViewModal}
            handlePageChange={(page) => handlePageChange("rejected", page)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 p-6 bg-gray-100">
          <ul className="flex text-sm font-medium text-gray-500 border-b">
            {tabs.map((tab) => (
              <li key={tab.key} className="mr-2">
                <button
                  className={`p-4 rounded-t-lg ${
                    activeTab === tab.key
                      ? "text-blue-600 font-bold bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="font-semibold text-lg">
                Oops! Something went wrong.
              </h3>
              <p>{error}</p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !error ? (
            <div className="w-full p-6 bg-gray-200 animate-pulse">
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>

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

export default EmployeeNewRequest;
