import {
  fetchAllTasks,
  fetchcompletedTasks,
  fetchPendingTasks,
  fetchProgressStepContainerData,
} from "../models/taskModels";

// Fetch all employee tasks
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
    throw new Error(error.message || "Error fetching all tasks.");
  }
};

// Fetch completed employee tasks
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
    throw new Error(error.message || "Error fetching completed tasks.");
  }
};

// Fetch pending employee tasks
export const fetchPending = async (approverId, page) => {
  try {
    const data = await fetchPendingTasks(approverId, page);
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
    throw new Error(error.message || "Error fetching pending tasks.");
  }
};

// Fetch progress data for a specific task
export const fetchProgress = async (requestId) => {
  try {
    const data = await fetchProgressStepContainerData(requestId);
    const { approvalData, taskData } = data;
    return {
      RequestData: approvalData || [],
      TaskData: taskData || [],
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching progress data.");
  }
};
