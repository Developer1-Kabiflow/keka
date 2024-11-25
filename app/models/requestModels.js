import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all requests for an employee 
export const fetchAllRequests = async (employeeId) => {
  try {
    console.log('employeeId in fetchAllRequests-->'+employeeId)
    const response = await axios.get(`${BASE_URL}/trackRequest/myRequest/${employeeId}`);
    return response.data;

  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch accepted requests for an employee 
export const fetchAcceptedRequests = async (employeeId) => {
    try {
      console.log('fetching accepted requests for employeeId-->'+employeeId)
      const response = await axios.get(`${BASE_URL}/trackRequest/employeeApprovedRequest/${employeeId}`);
      return response;
  
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error fetching requests");
    }
  };
  // Fetch rejected requests for an employee 
export const fetchRejectedRequests = async (employeeId) => {
    try {
      console.log('fetching rejected requests for employeeId-->'+employeeId)
      const response = await axios.get(`${BASE_URL}/trackRequest/employeeRejectedRequest/${employeeId}`);
      return response;
  
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error fetching requests");
    }
  };