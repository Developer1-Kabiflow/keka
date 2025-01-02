import {
  approveRequest,
  fetchAllRequests,
  fetchApprovedRequests,
  fetchPendingRequests,
  fetchRejectedRequests,
  rejectRequest,
} from "../models/approvalModels";

// Fetch all employee requests
export const fetchAll = async (approverId, page) => {
  try {
    const data = await fetchAllRequests(approverId, page);
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const employeeRequestList = data.employeeApprovalList || [];
    return {
      Allrequests: employeeRequestList || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching all requests"
    // );
  }
};
// Fetch approved employee requests
export const fetchApproved = async (approverId, page) => {
  try {
    const data = await fetchApprovedRequests(approverId, page);
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const filteredResults = data.filteredResults || [];
    const employeeApprovedRequestLists = filteredResults
      .map((item) => item.employee_approval_list || [])
      .flat();
    return {
      Approvedrequests: employeeApprovedRequestLists || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching approved requests"
    // );
  }
};

// Fetch rejected employee requests
export const fetchRejected = async (approverId, page) => {
  try {
    const data = await fetchRejectedRequests(approverId, page); // Fetch the response

    // Extract pagination details
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];

    // Safely extract `filteredResults` and ensure it's an array
    const filteredResults = data.filteredResults || [];

    // Flatten and combine all `employee_approval_list` from `filteredResults`
    const employeeRejectedRequestLists = filteredResults
      .map((item) => item.employee_approval_list || [])
      .flat();

    // Return the combined list along with pagination details
    return {
      Rejectedrequests: employeeRejectedRequestLists || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching rejected requests"
    // );
  }
};

// Fetch pending employee requests
export const fetchPending = async (approverId, page) => {
  try {
    const data = await fetchPendingRequests(approverId, page); // Fetch the response

    // Extract pagination details
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];

    // Safely extract `results` and ensure it's an array
    const results = data.results || [];

    // Flatten and combine all `employee_approval_list` from `results`
    const employeePendingRequestLists = results
      .map((item) => item.employee_approval_list || [])
      .flat();

    // Return the combined list along with pagination details
    return {
      Pendingrequests: employeePendingRequestLists || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    // throw new Error(
    //   error.response?.data?.message || "Error fetching pending requests"
    // );
  }
};

// Approve a request
export const handleApprove = async (approverId, requestId) => {
  try {
    const result = await approveRequest(approverId, requestId);
    return result === true; // Explicitly check for a boolean true if needed
  } catch (error) {
    console.error("Error in handleApprove:", error.message);
    return false; // Return false to indicate failure
  }
};

// Reject a request
export const handleReject = async (approverId, requestId, rejectionNote) => {
  try {
    const success = await rejectRequest(approverId, requestId, rejectionNote);
    return success;
  } catch (error) {
    throw new Error(error.message);
  }
};
