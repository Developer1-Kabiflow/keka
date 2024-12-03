import {
  fetchAllRequests,
  fetchApprovedRequests,
  fetchRejectedRequests,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
} from "../models/approvalModels";

// Fetch all employee requests
export const fetchAll = async (approverId) => {
  try {
    const data = await fetchAllRequests(approverId);
    const employeeRequestList = data.employee_approval_list || [];
    console.dir(employeeRequestList);

    return {
      Allrequests: employeeRequestList,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch accepted employee requests
export const fetchApproved = async (approverId) => {
  try {
    const data = await fetchApprovedRequests(approverId);
    const employeeAcceptedRequestLists = data.data
      .map((item) => item.employee_approval_list)
      .flat();

    return {
      Approvedrequests: employeeAcceptedRequestLists || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch rejected employee requests
export const fetchRejected = async (approverId) => {
  try {
    const data = await fetchRejectedRequests(approverId);
    const employeeRejectedRequestLists = data.data
      .map((item) => item.employee_approval_list)
      .flat();
    return {
      Rejectedrequests: employeeRejectedRequestLists || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
// Fetch rejected employee requests
export const fetchPending = async (approverId) => {
  try {
    const data = await fetchPendingRequests(approverId);
    const employeePendingRequestLists = data.data
      .map((item) => item.employee_approval_list)
      .flat();
    console.log("fetch pending");
    console.dir(employeePendingRequestLists);
    return {
      PendingRequests: employeePendingRequestLists || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const handleReject = async (approverId, requestId, rejectionNote) => {
  try {
    const success = await rejectRequest(approverId, requestId, rejectionNote);
    return success;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const handleApprove = async (approverId, requestId) => {
  try {
    const success = await approveRequest(approverId, requestId);
    return success;
  } catch (error) {
    throw new Error(error.message);
  }
};
