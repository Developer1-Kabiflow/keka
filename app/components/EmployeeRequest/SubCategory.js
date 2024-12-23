"use client";
import React, { useState, useEffect, useCallback } from "react";
import { fetchSubCategoryList } from "@/app/controllers/categoryController";
import Modal from "./Modal"; // Import your Modal component (adjust the path as needed)
import { toast } from "react-toastify";

const SubMenu = ({
  refreshData,
  categoryId,
  handleModalToggle,
  setSubCategoryId,
  isModalOpen,
  selectedSubCategoryId,
}) => {
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  // Define the fetchSubcategories function with useCallback to avoid unnecessary re-renders
  const fetchSubcategories = useCallback(async () => {
    try {
      if (!categoryId) return;
      const { subCategoryList } = await fetchSubCategoryList(categoryId);
      setSubCategoryList(subCategoryList || []);
    } catch (err) {
      setError(err.message || "Error fetching subcategories.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  if (loading) {
    return (
      <div className="flex flex-col p-4 bg-white text-center">
        {/* Skeleton Loader */}
        <div className="mb-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  // Handle the modal toggle
  const handleClick = (itemId) => {
    setSubCategoryId(itemId);
    handleModalToggle(itemId);
  };

  return (
    <>
      <div className="flex flex-col p-4 bg-white text-center">
        {subCategoryList.length > 0 ? (
          subCategoryList.map((item) => (
            <div key={item._id} className="mb-4">
              <span
                className="font-semibold cursor-pointer hover:text-blue-500"
                onClick={() => handleClick(item.form_template_id)} // Open modal on click
              >
                {item.subcategoryName}
              </span>
            </div>
          ))
        ) : (
          <p>No subcategories available</p>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalToggle}
        refreshData={refreshData} // Pass refreshData here
        itemId={selectedSubCategoryId}
        onToast={handleToast}
      />
    </>
  );
};

export default SubMenu;
