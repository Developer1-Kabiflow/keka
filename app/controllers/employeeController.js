import { fetchEmployeeData } from "@/app/models/employeeModel";
import { submitLogin } from "../models/loginModel";


export const fetchEmployeeDetails = async (employeeId) => {
  try {
    const data = await fetchEmployeeData(employeeId);
    return {
      userData: data, 
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching employee details");
  }
};

export const employeeLoginRequest = async (formData) => {
  try {
    return await submitLogin(formData); 
  } catch (error) {
    throw error;
  }
};
