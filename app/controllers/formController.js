import {
  fetchFormSchema,
  fetchMyFormdata,
  submitFormData,
} from "../models/formModels";

// Process form schema and prepare initial data
export const getProcessedFormSchema = async (formId, employeeId) => {
  try {
    const { fields, employeeData } = await fetchFormSchema(formId, employeeId);

    if (!fields || fields.length === 0) {
      throw new Error("Schema fields are empty or undefined");
    }

    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});

    return {
      formSchema: fields,
      formType: fields.formType || null, // Default to null if not present
      initialData,
      employeeData,
    };
  } catch (error) {
    console.error("Error in getProcessedFormSchema:", error.message);
    throw new Error("Failed to process form schema");
  }
};

export const getMyFormData = async (requestId) => {
  try {
    const { requestData, approvalData } = await fetchMyFormdata(requestId);
    if (!requestData || !approvalData) {
      throw new Error("Invalid form schema response");
    }
    return { requestData, approvalData };
  } catch (error) {
    console.error(
      "Error in getMyFormData:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Prepare form submission data and handle submission
export const handleFormSubmissionWithData = async (formId, submittedData) => {
  try {
    const result = await submitFormData(formId, submittedData);
    return { submittedData, result };
  } catch (error) {
    console.error("Error in handleFormSubmissionWithData:", error.message);
    throw error;
  }
};
