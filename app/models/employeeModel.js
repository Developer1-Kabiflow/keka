import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all requests for an employee (Server-side or Client-side based on usage)
export const fetchAllRequests = async (employeeId) => {
  try {
    console.log('employeeId in fetchAllRequests-->'+employeeId)
    const response = await axios.get(`${BASE_URL}/trackRequest/myRequest/${employeeId}`);
    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
