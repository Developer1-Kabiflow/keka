import BASE_URL from "@/utils/utils";
import axios from "axios";

export const fetchCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category/getCategory`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error on fetching category")
  }
};
