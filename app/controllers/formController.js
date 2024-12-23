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
    const { formFetched, enabledField } = await fetchTaskFormSchema(
      requestId,
      approverId
    );

    console.log("formFetched in getTaskFormSchema");
    console.dir(formFetched);
    console.log("enabledField in getTaskFormSchema");
    console.dir(enabledField);

    if (!formFetched || formFetched.length === 0) {
      throw new Error("Schema fields are empty or undefined");
    }

    // Use a Set to handle duplicates in enabledField
    const enabledFieldSet = new Set(enabledField);

    // Add "isDisabled" to each field
    const updatedFormSchema = formFetched.map((field) => {
      return {
        ...field,
        isDisabled: !enabledFieldSet.has(field.field_name), // Check if field_name is in the Set
      };
    });

    console.log("updatedFormSchema in getTaskFormSchema");
    console.dir(updatedFormSchema);

    return {
      formSchema: updatedFormSchema,
    };
  } catch (error) {
    console.error("Error in getProcessedFormSchema:", error.message);
    throw new Error("Failed to process form schema");
  }
};
