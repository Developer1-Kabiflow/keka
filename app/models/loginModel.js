import axios from "axios";
import BASE_URL from "@/utils/utils";

export const submitLogin = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/employee/login`, formData);
    console.log(formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed. Please try again.";
  }
};
