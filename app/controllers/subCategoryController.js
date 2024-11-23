const { fetchSubCategory } = require("../models/subCategoryModel");

export const fetchSubCategoryList = async (categoryId) => {
    if (!categoryId) {
      throw new Error("Category ID is required for fetching subcategory list");
    }
  
    try {
      const subCategoryData = await fetchSubCategory(categoryId);
      return { subCategoryList: subCategoryData }; // Ensure correct return structure
    } catch (error) {
      console.error("Error fetching subcategory list:", error);
      throw new Error(error.message);
    }
  };
  
