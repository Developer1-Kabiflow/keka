import axios from "axios";
import BASE_URL from "@/utils/utils";

export const fetchEmployeeData = async (employeeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/employee/details/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw new Error(error.message || "Failed to fetch employee data.");
  }
};
