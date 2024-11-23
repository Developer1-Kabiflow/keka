import { fetchFormSchema, fetchMyFormdata, submitFormData } from "../models/formModel";

// Process form schema and prepare initial data
export const getProcessedFormSchema = async (formId) => {
  try {
    const schema = await fetchFormSchema(formId);
    if (!schema || !schema.data) {
      throw new Error("Schema data is undefined");
    }
    const initialData = schema.data.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});
    return { formSchema: schema, formType: schema.formType, initialData };
  } catch (error) {
    console.error("Error in getProcessedFormSchema:", error.response?.data || error.message);
    throw error;
  }
};

export const getMyFormData = async (requestId) => {
  try {
    // console.log("Processing form for requestId:", requestId);
    const { requestData, approvalData } = await fetchMyFormdata(requestId);
    if (!requestData || !approvalData) {
      throw new Error("Invalid form schema response");
    }
    return { requestData, approvalData };
  } catch (error) {
    console.error("Error in getMyFormData:", error.response?.data || error.message);
    throw error;
  }
};


// Prepare form submission data and handle submission
export const handleFormSubmissionWithData = async (formId, submittedData) => {
  try {
    // console.log("Processing form submission data...");
    const result = await submitFormData(formId, submittedData);
    // console.log("Form submission result:", result);
    return { submittedData, result };
  } catch (error) {
    console.error("Error in handleFormSubmissionWithData:", error.message);
    throw error;
  }
};
