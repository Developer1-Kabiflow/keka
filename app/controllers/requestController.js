import {
  fetchAcceptedRequests,
  fetchAllRequests,
  fetchRejectedRequests,
} from "../models/requestModels";

// Fetch all employee requests
export const fetchAllEmployeeRequests = async (employeeId) => {
  try {
    const data = await fetchAllRequests(employeeId);
    return {
      Allrequests: data.requests.employee_request_list || [],
      formTemplateData: data.formTemplates || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch accepted employee requests
export const fetchApprovedEmployeeRequests = async (employeeId) => {
  try {
    const data = await fetchAcceptedRequests(employeeId);
    const employeeAcceptedRequestLists = data.data
      .map((item) => item.employee_request_list)
      .flat();

    return {
      Approvedrequests: employeeAcceptedRequestLists || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch rejected employee requests
export const fetchRejectedEmployeeRequests = async (employeeId) => {
  try {
    const data = await fetchRejectedRequests(employeeId);
    const employeeRejectedRequestLists = data.data
      .map((item) => item.employee_request_list)
      .flat();
    return {
      Rejectedrequests: employeeRejectedRequestLists || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
