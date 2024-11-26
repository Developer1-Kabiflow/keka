import { fetchAllRequests, fetchEmployeeData } from "@/app/models/employeeModel";
import { submitLogin } from "../models/loginModel";



// Fetch employee requests server-side

export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const data = await fetchEmployeeData(employeeId);
    return {
      userData: data,  // Corrected return structure
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching employee details");
  }
};


export const fetchEmployeeRequests = async (employeeId) => {
  try {
    const data = await fetchAllRequests(employeeId);
    return {
      requests: data.requests || [],
      formTemplates: data.formTemplates || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const employeeLoginRequest = async (formData) => {
  try {
    return await submitLogin(formData); // Return the complete response from the API
  } catch (error) {
    throw error; // Ensure the error propagates to the calling function
  }
};