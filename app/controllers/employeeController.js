import { fetchAllRequests } from "@/app/models/employeeModel";

// Fetch employee requests server-side
export const fetchEmployeeRequests = async (employeeId) => {
  try {
    const data = await fetchAllRequests(employeeId);
    return {
      requests: data.requests || [],
      formTemplates: data.formTemplates || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

