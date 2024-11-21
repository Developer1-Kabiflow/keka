import { fetchAllRequests } from "@/app/models/requestModel";

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
