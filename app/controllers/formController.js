import {
  fetchFormSchema,
  fetchMyFormdata,
  fetchTaskFormSchema,
  submitFormData,
  submitTaskFormData,
} from "../models/formModels";

// Process form schema and prepare initial data
export const getProcessedFormSchema = async (formId, employeeId) => {
  try {
    const response = await fetchFormSchema(formId, employeeId);

    if (!response?.data || !response?.employeeData || !response?.attachments) {
      throw new Error("Incomplete or invalid form schema response");
    }

    const fields = response.data; // Schema fields
    const employeeData = response.employeeData; // Employee-specific data
    const fileAttachments = response.attachments;
    const date = response.date;

    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});

    return {
      formSchema: fields,
      formType: fields.formType || null, // Default to null if not present
      initialData,
      employeeData,
      attachments: fileAttachments,
      date: date,
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
export const handleTaskFormSubmission = async (
  requestId,
  approverId,
  formDataToSubmit
) => {
  try {
    const result = await submitTaskFormData(
      requestId,
      approverId,
      formDataToSubmit
    );
    return { formDataToSubmit, result }; // Return both formData and response data
  } catch (error) {
    console.error("Error in handleFormSubmissionWithData:", error.message);
    throw error; // Propagate the error
  }
};
export const getTaskFormSchema = async (requestId, approverId) => {
  try {
    const response = await fetchTaskFormSchema(requestId, approverId);
    const { formFetched, enabledField, enabledAttatchments } = response;
    if (!formFetched?.fields || formFetched.fields.length === 0) {
      throw new Error("Schema fields are empty or undefined");
    }

    return {
      formData: formFetched.fields,
      formAttachments: formFetched.attachments || [],
      enabledField: enabledField || [],
      enabledAttatchments: enabledAttatchments || [],
    };
  } catch (error) {
    console.error("Error in getTaskFormSchema:", error.message);
    throw new Error("Failed to fetch and process form schema");
  }
};
