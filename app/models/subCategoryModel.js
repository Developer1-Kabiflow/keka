import BASE_URL from "@/utils/utils";
const axios = require("axios");

export const fetchSubCategory = async (categoryId) => {
    console.log("Fetching SubCategory for ID:", categoryId);
  
    if (!categoryId) {
      throw new Error("Category ID is required");
    }
  
    try {
      const response = await axios.get(`${BASE_URL}/category/getSubCategory/${categoryId}`);
      return response.data.data; // Return only the 'data' array
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      throw new Error(error.response?.data?.message || "Error fetching subcategories");
    }
  };
  
