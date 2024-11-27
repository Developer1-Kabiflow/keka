import { fetchCategory, fetchSubCategory } from "../models/categoryModel";

export const fetchCategoryList = async () => {
  try {
    const categoryData = await fetchCategory();
    return {
      category: categoryData, // Check if this is an array
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

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
