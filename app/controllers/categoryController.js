import { fetchCategory } from "../models/categoryModel";

export const fetchCategoryList = async () => {
    try {
      const categoryData  = await fetchCategory();
      return {
        category: categoryData, // Check if this is an array
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  