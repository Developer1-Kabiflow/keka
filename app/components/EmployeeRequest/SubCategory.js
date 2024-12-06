"use client";
import React, { useState, useEffect } from "react";
import { fetchSubCategoryList } from "@/app/controllers/categoryController";
import { fetchAllEmployeeRequests } from "@/app/controllers/requestController"; // Import your subcategory fetch method
import Modal from "./Modal"; // Import your Modal component (adjust the path as needed)
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const SubMenu = ({
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
  const loadRequestData = async (employeeId) => {
    try {
      const { Allrequests } = await fetchAllEmployeeRequests(employeeId);
      setAllRequest(Allrequests);
    } catch (err) {
      // setError(err.message || "Error fetching request data.");
    } finally {
      setLoading(false);
    }
  };
  const refreshData = () => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId);
    }
  };
  const fetchSubcategories = async () => {
    try {
      if (!categoryId) return;
      const { subCategoryList } = await fetchSubCategoryList(categoryId);
      setSubCategoryList(subCategoryList || []);
    } catch (err) {
      setError(err.message || "Error fetching subcategories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]); // Re-fetch subcategories when categoryId changes

  if (loading) return <p></p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Handle the modal toggle
  const handleClick = (itemId) => {
    setSubCategoryId(itemId);
    handleModalToggle(itemId); // Toggle the modal
  };

  return (
    <>
      <div className="flex flex-col p-4 bg-white text-center">
        {/* <span className="font-semibold text-lg mb-4 underline decoration-4 decoration-blue-500">
          Subcategories
        </span> */}
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
        refreshData={refreshData}
        itemId={selectedSubCategoryId}
        onToast={handleToast}
      />
    </>
  );
};

export default SubMenu;
