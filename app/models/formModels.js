import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch form schema from backend
export const fetchFormSchema = async (formId, employeeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/template/fetchForm/${formId}/${employeeId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching form schema."
    );
  }
};

// Fetch form data
export const fetchMyFormdata = async (requestId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/request/getMyFormData/${requestId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching form data."
    );
  }
};

// Submit form data to backend
export const submitFormData = async (formId, formData) => {
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
    throw new Error(
      error.response?.data?.message || "Error submitting form data."
    );
  }
};

// Fetch task form schema
export const fetchTaskFormSchema = async (requestId, approverId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/taskForm/getTaskForm/${requestId}/${approverId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching task form schema."
    );
  }
};

// Submit task form data
export const submitTaskFormData = async (requestId, approverId, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/taskForm/formSubmit/${requestId}/${approverId}`,
      formData
    );
    return response.status === 200;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error submitting task form data."
    );
  }
};

// Download a file
export const download = async (fileUrl) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/download/downloadRDoc/${encodeURIComponent(fileUrl)}`,
      {
        responseType: "blob", // Expect binary data (file content)
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error downloading the file."
    );
  }
};
