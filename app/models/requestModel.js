import axios from "axios";
import BASE_URL from "@/utils/utils";

export const fetchAllRequests = async (employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/trackRequest/myRequest/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
