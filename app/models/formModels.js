import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch form schema from backend
export const fetchFormSchema = async (formId, employeeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/template/fetchForm/${formId}/${employeeId}`
    );

    if (
      !response?.data?.data ||
      !response?.data?.employeeData ||
      !response?.data?.attachments
    ) {
      throw new Error("Incomplete or invalid form schema response");
    }

    console.log("employee in model-->", response.data.employeeData);

    return {
      fields: response.data.data, // Schema fields
      employeeData: response.data.employeeData, // Employee-specific data
      fileAttachments: response.data.attachments,
    };
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
  formData.forEach((value, key) => {
    console.log("FormData in models==>>", key, value);
  });

  try {
    const response = await axios.post(
      `${BASE_URL}/request/addRequest/${formId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure multipart header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in submitFormData:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Fetch pending requests for an employee
export const fetchTaskFormSchema = async (requestId, approverId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/taskForm/getTaskForm/${requestId}/${approverId}`
    );
    console.log(`${BASE_URL}/taskForm/getTaskForm/${requestId}/${approverId}`);
    console.dir(response.data);
    return response.data;
  } catch (error) {
    //throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const submitTaskFormData = async (approverId, requestId, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/taskForm/formSubmit/${requestId}/${approverId}`,
      formData
    );

    return response.status === 200;
  } catch (error) {
    console.error(
      "Error in submitTaskFormData:",
      error.response?.data?.message || error.message
    );
    return false;
  }
};
