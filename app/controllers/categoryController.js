import { fetchCategory, fetchSubCategory } from "../models/categoryModel";

export const fetchCategoryList = async () => {
  try {
    const categoryData = await fetchCategory();
    return {
      category: categoryData,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching category list");
  }
};

export const fetchSubCategoryList = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required for fetching subcategory list");
  }

  try {
    const subCategoryData = await fetchSubCategory(categoryId);
    return { subCategoryList: subCategoryData };
  } catch (error) {
    throw new Error(error.message || "Error fetching subcategory list");
  }
};
