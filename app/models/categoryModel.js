import BASE_URL from "@/utils/utils";
import axios from "axios";

export const fetchCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category/getCategory`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error on fetching category"
    );
  }
};

export const fetchSubCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/category/getSubCategory/${categoryId}`
    );
    return response.data.data; // Return only the 'data' array
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching subcategories"
    );
  }
};
