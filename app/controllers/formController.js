import {
  fetchFormSchema,
  fetchMyFormdata,
  submitFormData,
  submitTaskFormData,
} from "../models/formModels";

// Process form schema and prepare initial data
export const getProcessedFormSchema = async (formId, employeeId) => {
  try {
    const { fields, employeeData, fileAttachments } = await fetchFormSchema(
      formId,
      employeeId
    );

    if (!fields || fields.length === 0) {
      throw new Error("Schema fields are empty or undefined");
    }

    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});

    console.log("employeeData: - ", fileAttachments);

    return {
      formSchema: fields,
      formType: fields.formType || null, // Default to null if not present
      initialData,
      employeeData,
      attachments: fileAttachments,
    };
  } catch (error) {
    console.error("Error in getProcessedFormSchema:", error.message);
    throw new Error("Failed to process form schema");
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
    console.error(
      "Error in getMyFormData:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Prepare form submission data and handle submission

export const handleFormSubmissionWithData = async (
  formId,
  formDataToSubmit
) => {
  try {
    const result = await submitFormData(formId, formDataToSubmit);
    return { formDataToSubmit, result }; // Return both formData and response data
  } catch (error) {
    console.error("Error in handleFormSubmissionWithData:", error.message);
    throw error; // Propagate the error
  }
};
export const handleTaskFormSubmission = async (formId, formDataToSubmit) => {
  try {
    const result = await submitTaskFormData(formId, formDataToSubmit);
    return { formDataToSubmit, result }; // Return both formData and response data
  } catch (error) {
    console.error("Error in handleFormSubmissionWithData:", error.message);
    throw error; // Propagate the error
  }
};
