import {
  fetchAllTasks,
  fetchcompletedTasks,
  fetchPendingTasks,
  fetchProgressStepContainerData,
} from "../models/taskModels";

// Fetch all employee requests
export const fetchAll = async (approverId, page) => {
  try {
    const data = await fetchAllTasks(approverId, page);
    const { currentPage, totalPages, totalTasks } = data;
    const paginationDetails = [totalPages, currentPage, totalTasks];
    const AllTaskLists = data.taskResult?.flatMap(
      (result) => result.employee_approval_list || []
    );
    return {
      Allrequests: AllTaskLists || [],
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
    const { currentPage, totalPages, totalTasks } = data;
    const paginationDetails = [totalPages, currentPage, totalTasks];
    const CompletedTaskLists = data.taskResult?.flatMap(
      (result) => result.employee_approval_list || []
    );

    return {
      Completedrequests: CompletedTaskLists || [],
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
    const { currentPage, totalPages, totalTasks } = data;
    const paginationDetails = [totalPages, currentPage, totalTasks];
    const PendingTaskLists = data.taskResult?.flatMap(
      (result) => result.employee_approval_list || []
    );

    return {
      Pendingrequests: PendingTaskLists || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching rejected requests"
    // );
  }
};

export const fetchProgress = async (requestId) => {
  try {
    const data = await fetchProgressStepContainerData(requestId);
    const { approvalData, taskData } = data;
    return {
      RequestData: approvalData || [],
      TaskData: taskData || [],
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching rejected requests"
    // );
  }
};
