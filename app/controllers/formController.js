import {
  download,
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

    if (!response?.data || !response?.employeeData) {
      throw new Error("Incomplete or invalid form schema response");
    }

    const fields = response.data;
    const employeeData = response.employeeData;
    const fileAttachments = response.attachments;
    const date = response.date;

    const initialData = fields.reduce((acc, field) => {
      acc[field.name] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});

    return {
      formSchema: fields,
      formType: response.formType || null,
      initialData,
      employeeData,
      attachments: fileAttachments,
      date: date,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to process form schema");
  }
};

export const getMyFormData = async (requestId) => {
  try {
    const response = await fetchMyFormdata(requestId);
    const { requestData, approvalData } = response;
    if (!requestData || !approvalData) {
      throw new Error("Invalid form schema response");
    }
    return { requestData, approvalData };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch form data");
  }
};

// Prepare form submission data and handle submission
export const handleFormSubmissionWithData = async (
  formId,
  formDataToSubmit
) => {
  try {
    const result = await submitFormData(formId, formDataToSubmit);
    return { formDataToSubmit, result };
  } catch (error) {
    throw new Error(error.message || "Failed to submit form data");
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
    return { formDataToSubmit, result };
  } catch (error) {
    throw new Error(error.message || "Failed to submit task form data");
  }
};

export const getTaskFormSchema = async (requestId, approverId) => {
  try {
    const response = await fetchTaskFormSchema(requestId, approverId);
    const { formFetched, enabledField, enabledAttachments } = response;

    if (!formFetched?.fields || formFetched.fields.length === 0) {
      throw new Error("Schema fields are empty or undefined");
    }

    return {
      formData: formFetched.fields || [],
      formAttachments: formFetched.attachments || [],
      attachedFiles: formFetched.attachedFiles || [],
      enabledField: enabledField || [],
      enabledAttachments: enabledAttachments || [],
    };
  } catch (error) {
    throw new Error(
      error.message || "Failed to fetch and process task form schema"
    );
  }
};

export const downloadFile = async (requestId, fileUrl) => {
  try {
    const response = await download(requestId, fileUrl);
    return response;
  } catch (error) {
    throw new Error(error.message || "Error in downloading the file");
  }
};
