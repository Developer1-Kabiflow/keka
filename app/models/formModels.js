import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch form schema from backend
export const fetchFormSchema = async (formId, employeeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/template/fetchForm/${formId}/${employeeId}`
    );

    if (!response?.data?.data || !response?.data?.employeeData) {
      throw new Error("Incomplete or invalid form schema response");
    }

    return {
      fields: response.data.data, // Schema fields
      employeeData: response.data.employeeData, // Employee-specific data
    };
    log;
  } catch (error) {
    console.error("Error in fetchFormSchema:", error.message);
    throw error;
  }
};

// Fetch form data
export const fetchMyFormdata = async (requestId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/request/getMyFormData/${requestId}`
    );
    console.log(`${BASE_URL}/request/getMyFormData/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in fetchFormSchema:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Submit form data to backend
export const submitFormData = async (formId, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/request/addRequest/${formId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error in submitFormData:", error.message);
    throw error;
  }
};
