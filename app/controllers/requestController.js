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
      Allrequests: data.requests || [],
      formTemplateData: data.formTemplates || [],
      pagination: paginationDetails,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch accepted employee requests
export const fetchApprovedEmployeeRequests = async (employeeId, page) => {
  try {
    const data = await fetchApprovedRequests(employeeId, page);

    // Extract pagination details
    const { totalPages, currentPage, totalResults } = data;

    // Flatten the nested `employee_request_list` from each result in `results`
    const employeeAcceptedRequestLists = data.results?.flatMap(
      (result) => result.employee_request_list || []
    );

    return {
      Approvedrequests: employeeAcceptedRequestLists || [],
      pagination: { totalPages, currentPage, totalResults },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch rejected employee requests
export const fetchRejectedEmployeeRequests = async (employeeId, page) => {
  try {
    const data = await fetchRejectedRequests(employeeId, page);
    const { totalPages, currentPage, totalResults } = data;
    const employeeRejectedRequestLists = data.results?.flatMap(
      (result) => result.employee_request_list || []
    );
    return {
      Rejectedrequests: employeeRejectedRequestLists || [],
      pagination: { totalPages, currentPage, totalResults },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
