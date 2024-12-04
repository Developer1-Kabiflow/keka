import React, { useState, useEffect } from "react";
import Link from "next/link"; // Or "react-router-dom" if using React Router
import { fetchCategoryList } from "@/app/controllers/categoryController";
import SubMenu from "./SubCategory"; // Import the SubMenu component

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedSubCategoryId, setSubCategoryId] = useState(null); // Track selected subcategory ID

  const fetchCategoryData = async () => {
    try {
      const { category } = await fetchCategoryList();
      setCategories(category || []);
    } catch (err) {
      setError(err.message || "Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const handleModalToggle = (itemId) => {
    setSubCategoryId(itemId); // Set the selected subcategory ID
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-col space-y-4">
        {categories.map((item) => (
          <div key={item._id}>
            <Link
              href="#"
              className="block p-2 bg-green-100 rounded-md hover:bg-green-200 mb-2 text-center"
              onClick={() => setSelectedCategory(item)} // Set the selected category on click
            >
              {item.categoryName}
            </Link>
            {selectedCategory && selectedCategory._id === item._id && (
              <SubMenu
                categoryId={item._id}
                handleModalToggle={handleModalToggle} // Pass down modal toggle handler
                setSubCategoryId={setSubCategoryId} // Pass down setSubCategoryId
                isModalOpen={isModalOpen} // Pass down isModalOpen state
                selectedSubCategoryId={selectedSubCategoryId} // Pass down selectedSubCategoryId state
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
