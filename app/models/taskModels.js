import axios from "axios";
import BASE_URL from "@/utils/utils";

export const fetchAllTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchAllTask/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchcompletedTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchCompletedTask/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchPendingTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchPendingTask/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchProgressStepContainerData = async (requestId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/progress/status/${requestId}`
    );
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch progress status");
  }
};
