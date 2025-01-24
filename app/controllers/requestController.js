import {
  fetchAllRequests,
  fetchApprovedRequests,
  fetchRejectedRequests,
} from "../models/requestModels";

// Fetch all employee requests
export const fetchAllEmployeeRequests = async (employeeId, page) => {
  try {
    const data = await fetchAllRequests(employeeId, page);

    const { totalPages, currentPage, totalRequests } = data;
    const paginationDetails = [totalPages, currentPage, totalRequests];

    return {
      Allrequests: data.results?.flatMap((result) => result || []) || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching all employee requests");
  }
};

// Fetch accepted employee requests
export const fetchApprovedEmployeeRequests = async (employeeId, page) => {
  try {
    const data = await fetchApprovedRequests(employeeId, page);
    const { totalPages, currentPage, totalResults } = data;
    const employeeAcceptedRequestLists =
      data.results?.flatMap((result) => result || []) || [];

    return {
      Approvedrequests: employeeAcceptedRequestLists || [],
      pagination: { totalPages, currentPage, totalResults },
    };
  } catch (error) {
    throw new Error(
      error.message || "Error fetching approved employee requests"
    );
  }
};

// Fetch rejected employee requests
export const fetchRejectedEmployeeRequests = async (employeeId, page) => {
  try {
    const data = await fetchRejectedRequests(employeeId, page);
    const { totalPages, currentPage, totalResults } = data;
    const employeeRejectedRequestLists =
      data.results?.flatMap((result) => result || []) || [];

    return {
      Rejectedrequests: employeeRejectedRequestLists || [],
      pagination: { totalPages, currentPage, totalResults },
    };
  } catch (error) {
    throw new Error(
      error.message || "Error fetching rejected employee requests"
    );
  }
};
