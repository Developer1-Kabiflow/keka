import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all requests for an employee
export const fetchAllRequests = async (employeeId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myRequest/${employeeId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch accepted requests for an employee

export const fetchApprovedRequests = async (employeeId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/employeeApprovedRequest/${employeeId}?page=${page}&pageLimit=10`
    );
    // Return only the relevant data part of the response
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

// Fetch rejected requests for an employee
export const fetchRejectedRequests = async (employeeId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/employeeRejectedRequest/${employeeId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
