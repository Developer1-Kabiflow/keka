import { fetchAllRequests } from "@/app/models/requestModel";

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

// Example usage in a page component
export async function getServerSideProps(context) {
  const { employeeId } = context.params;

  try {
    const { requests, formTemplates } = await fetchEmployeeRequests(employeeId);

    return {
      props: {
        requests,
        formTemplates,
      },
    };
  } catch (error) {
    return {
      notFound: true, // Handle error or fallback
    };
  }
}
