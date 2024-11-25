import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch form schema from backend
export const fetchFormSchema = async (formId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/template/fetchForm/${formId}`
    );
    if (!response.data || !response.data.data) {
      throw new Error("Invalid form schema response");
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchFormSchema:", error.message);
    throw error;
  }
};

// Fetch form data
export const fetchMyFormdata = async (requestId) => {
  try {
    console.log("RequestId:", requestId);
    const response = await axios.get(
      `${BASE_URL}/request/getMyFormData/${requestId}`
    );
    // console.log("Form schema response:", response);
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
