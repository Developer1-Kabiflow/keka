import {
  fetchAllTasks,
  fetchcompletedTasks,
  fetchPendingTasks,
  fetchProgressStepContainerData,
} from "../models/taskModels";

// Fetch all employee requests
export const fetchAll = async (approverId, page) => {
  try {
    console.log("test");
    const data = await fetchAllTasks(approverId, page);
    const { currentPage, totalPages, totalTasks } = data;
    const paginationDetails = [totalPages, currentPage, totalTasks];
    console.dir(paginationDetails);
    return {
      Allrequests: data.taskResult?.employee_approval_list || [],
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
    console.dir(paginationDetails);
    const employeeCompletedTaskLists = data.taskResult?.flatMap(
      (result) => result.employee_approval_list || []
    );

    return {
      Completedrequests: employeeCompletedTaskLists || [],
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
    console.dir(paginationDetails);
    const employeePendingTaskLists =
      data.taskResult?.employee_approval_list || [];

    return {
      Pendingrequests: employeePendingTaskLists || [],
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
    console.dir(taskData);
    console.dir(approvalData);
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
