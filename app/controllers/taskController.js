import {
  fetchAllTasks,
  fetchcompletedTasks,
  fetchPendingTasks,
} from "../models/taskModels";

// Fetch all employee requests
export const fetchAll = async (approverId, page) => {
  try {
    const data = await fetchAllTasks(approverId, page);
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const employeeTaskList = data.taskResult || [];
    return {
      Allrequests: employeeTaskList || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching all requests"
    // );
  }
};
// Fetch approved employee requests
export const fetchCompleted = async (approverId, page) => {
  try {
    const data = await fetchcompletedTasks(approverId, page);
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const employeeTaskList = data.taskResult || [];

    return {
      Completedrequests: employeeTaskList || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching approved requests"
    // );
  }
};

// Fetch rejected employee requests
export const fetchPending = async (approverId, page) => {
  try {
    const data = await fetchPendingTasks(approverId, page); // Fetch the response

    // Extract pagination details
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const employeeTaskList = data.taskResult || [];

    return {
      Pendingrequests: employeeTaskList || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching rejected requests"
    // );
  }
};
