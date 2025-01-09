import {
  approveRequest,
  fetchAllRequests,
  fetchApprovedRequests,
  fetchPendingRequests,
  fetchRejectedRequests,
  rejectRequest,
  showShare,
  submitShare,
} from "../models/approvalModels";

// Fetch all employee requests
export const fetchAll = async (approverId, page) => {
  try {
    const data = await fetchAllRequests(approverId, page);
    if (data.error) {
      throw new Error(data.error);
    }
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const employeeRequestList = data.employeeApprovalList || [];
    return {
      Allrequests: employeeRequestList,
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching all requests.");
  }
};

// Fetch approved employee requests
export const fetchApproved = async (approverId, page) => {
  try {
    const data = await fetchApprovedRequests(approverId, page);
    if (data.error) {
      throw new Error(data.error);
    }
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const filteredResults = data.filteredResults || [];
    const employeeApprovedRequestLists = filteredResults
      .map((item) => item.employee_approval_list || [])
      .flat();
    return {
      Approvedrequests: employeeApprovedRequestLists,
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching approved requests.");
  }
};

// Fetch rejected employee requests
export const fetchRejected = async (approverId, page) => {
  try {
    const data = await fetchRejectedRequests(approverId, page);
    if (data.error) {
      throw new Error(data.error);
    }
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const filteredResults = data.filteredResults || [];
    const employeeRejectedRequestLists = filteredResults
      .map((item) => item.employee_approval_list || [])
      .flat();
    return {
      Rejectedrequests: employeeRejectedRequestLists,
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching rejected requests.");
  }
};

// Fetch pending employee requests
export const fetchPending = async (approverId, page) => {
  try {
    const data = await fetchPendingRequests(approverId, page);
    if (data.error) {
      throw new Error(data.error);
    }
    const { totalPages, currentPage, totalResults } = data;
    const paginationDetails = [totalPages, currentPage, totalResults];
    const results = data.results || [];
    const employeePendingRequestLists = results
      .map((item) => item.employee_approval_list || [])
      .flat();
    return {
      Pendingrequests: employeePendingRequestLists,
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching pending requests.");
  }
};

// Approve a request
export const handleApprove = async (approverId, requestId) => {
  try {
    const result = await approveRequest(approverId, requestId);
    if (result.error) {
      throw new Error(result.error);
    }
    return result === true;
  } catch (error) {
    throw new Error(error.message || "Error approving the request.");
  }
};

// Reject a request
export const handleReject = async (approverId, requestId, rejectionNote) => {
  try {
    const result = await rejectRequest(approverId, requestId, rejectionNote);
    if (result.error) {
      throw new Error(data.result);
    }
    return result;
  } catch (error) {
    throw new Error(error.message || "Error rejecting the request.");
  }
};

export const showShareOption = async () => {
  try {
    const options = await showShare();
    if (options.error) {
      throw new Error(options.error);
    }
    return options;
  } catch (error) {
    throw new Error(error.message || "Error fetching share options.");
  }
};

export const handleShare = async (requestId, approverId, sharingFlowId) => {
  try {
    const success = await submitShare(requestId, approverId, sharingFlowId);
    if (success.error) {
      throw new Error(success.error);
    }
    return success;
  } catch (error) {
    throw new Error(error.message || "Error submitting share request.");
  }
};
