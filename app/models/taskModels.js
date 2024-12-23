import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all accepted for an employee
export const fetchAllTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchAllTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.log(
      `${BASE_URL}/task/fetchAllTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.dir(response.data);
    return response.data;
  } catch (error) {
    // throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchcompletedTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchCompletedTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.log(
      `${BASE_URL}/task/fetchCompletedTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.dir(response.data);
    return response.data;
  } catch (error) {
    //   throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch rejected requests for an employee
export const fetchPendingTasks = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/task/fetchPendingTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.log(
      `${BASE_URL}/task/fetchPendingTask/${approverId}?page=${page}&pageLimit=10`
    );
    console.dir(response.data);
    return response.data;
  } catch (error) {
    //  throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
