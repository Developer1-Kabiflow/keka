"use client";
import { useState, useEffect } from "react";
import {
  getProcessedFormSchema,
  handleFormSubmissionWithData,
} from "@/app/controllers/formController";
import Cookies from "js-cookie";

const Modal = ({ isOpen, handleClose, itemId, onToast, refreshData }) => {
  const [formSchema, setFormSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const [startingDate, setStartingDate] = useState("");
  const [initialDate, setInitialDate] = useState("");

  const formId = itemId;

  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
    if (isOpen) {
      setFormSchema([]);
      setFormData({});
      setFormErrors({});
      setSelectedFiles([]);
      setFileAttachments([]);
      setError(null);
      const fetchForm = async () => {
        try {
          setLoading(true);
          const employeeId = Cookies.get("userId");
          const {
            formSchema = [],
            formType = "",
            initialData = {},
            employeeData = {},
            attachments = [],
            date = "",
          } = await getProcessedFormSchema(formId, employeeId);
          setInitialDate(date);
          setFormSchema(formSchema);
          setFormType(formType);
          setFormData(initialData);
          setEmployeeDetails(employeeData);
          setFileAttachments(attachments || []);
        } catch (err) {
          setError(
            err.message || "Failed to load form schema. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    }
  }, [isOpen, formId]);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles(new Array(fileAttachments.length).fill(null));
    }
  }, [isOpen, fileAttachments.length]);

  const validateField = (name, value, validationRules) => {
    for (const rule of validationRules) {
      if (rule.pattern) {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(value)) {
          return rule.message;
        }
      } else if (rule.maxSize && value.size > rule.maxSize) {
        return `File size exceeds the limit of ${
          rule.maxSize / 1024 / 1024
        } MB.`;
      } else if (rule.allowedTypes && !rule.allowedTypes.includes(value.type)) {
        return `Invalid file type. Allowed types: ${rule.allowedTypes.join(
          ", "
        )}`;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "date" && name === "LeaveStartingDate") {
      setStartingDate(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
            ? [...(prevData[name] || []), value]
            : prevData[name].filter((item) => item !== value)
          : value,
    }));

    if (Array.isArray(formSchema)) {
      const fieldSchema = formSchema.find((field) => field.name === name);
      const errorMessage = fieldSchema
        ? validateField(name, value, fieldSchema.validation || [])
        : null;

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    } else {
      console.error("formSchema is not an array:", fieldSchema);
    }
  };

  const handleRadioChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
    setEmployeeDetails((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent further submissions if already submitting

    setIsSubmitting(true); // Set submitting state
    // Step 1: Validate form fields
    const errors = formSchema.reduce((acc, field) => {
      const fieldValue = formData[field.name] || "";
      const error = validateField(
        field.name,
        fieldValue,
        field.validation || []
      );
      if (error) {
        acc[field.name] = error;
      }
      return acc;
    }, {});

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false); // Allow resubmission after resolving errors
      return; // Exit if there are validation errors
    }
    try {
      // Step 2: Prepare form data
      const submittedData = formSchema.reduce((acc, field) => {
        if (field.disabled && employeeDetails && employeeDetails[field.label]) {
          acc[field.name] = employeeDetails[field.label] || "";
        } else {
          acc[field.name] = formData[field.name] || "";
        }
        return acc;
      }, {});

      const formDataToSubmit = new FormData();

      // Append form fields
      Object.entries(submittedData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      selectedFiles.forEach((file) => {
        formDataToSubmit.append("files[]", file); // Append files to FormData
      });

      await handleFormSubmissionWithData(formId, formDataToSubmit);
      onToast("Created Request Successfully", "success");

      refreshData(); // Call refreshData from the grandparent
      handleClose();
    } catch (err) {
      setError(err.message || "Error submitting form");
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };

  const validateFile = (file, validation) => {
    if (validation.maxSize && file.size > validation.maxSize) {
      return `File size exceeds the limit of ${
        validation.maxSize / 1024 / 1024
      } MB.`;
    }
    if (
      validation.allowedTypes &&
      !validation.allowedTypes.includes(file.type)
    ) {
      return `Invalid file type. Allowed types: ${validation.allowedTypes.join(
        ", "
      )}`;
    }
    return null;
  };

  const handleFileChange = (e, attachment, index) => {
    const file = e.target.files[0];
    const error = validateFile(file, attachment.validation[0]);
    const updatedFileErrors = [...fileErrors];
    updatedFileErrors[index] = error;
    setFileErrors(updatedFileErrors);
    if (!error) {
      setSelectedFiles((prev) => {
        const updatedFiles = [...prev];
        updatedFiles[index] = file;
        return updatedFiles;
      });
    }
  };

  const renderFile = (attachment, index) => (
    <div
      key={index}
      className="mb-6 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <label
        htmlFor={`file-upload-${index}`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {attachment.display}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id={`file-upload-${index}`}
          name={`file-upload-${index}`}
          required={attachment.required}
          onChange={(e) => handleFileChange(e, attachment, index)} // Pass attachment for validation
        />
      </div>
      {/* Validation Error Message */}
      {fileErrors[index] && (
        <p className="mt-2 text-sm text-red-500">{fileErrors[index]}</p>
      )}
    </div>
  );

  const renderField = (field) => {
    if (field.type === "radio") {
      return (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700">{field.label}:</label>
          {field.options.map((option) => (
            <div key={option} className="flex items-center mb-2">
              <input
                type="radio"
                name={field.name} // Corrected to use field.name instead of field.label for grouping
                value={option}
                checked={employeeDetails[field.label] === option}
                onChange={(e) => handleRadioChange(e, field.name)}
                required={field.required}
                className="mr-2"
              />
              <label className="text-gray-700">{option}</label>
            </div>
          ))}
        </div>
      );
    } else if (field.type === "select") {
      return (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700">{field.label}:</label>
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="" disabled>
              Select an option
            </option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {formErrors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors[field.name] || "Invalid input."}
            </p>
          )}
        </div>
      );
    } else if (field.type === "date") {
      return (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700">{field.label}:</label>
          <input
            type="date"
            name={field.name}
            min={
              field.name === "LeaveEndingDate" && startingDate
                ? startingDate
                : field.min
                ? initialDate
                : undefined
            }
            onChange={handleChange}
            required={field.required}
            className="w-full px-3 py-2 border rounded"
          />
          {formErrors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors[field.name] || "Invalid input."}
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700">{field.display}:</label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={
              field.disabled && employeeDetails
                ? employeeDetails[field.label]
                : formData[field.name] || ""
            }
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
            className="w-full px-3 py-2 border rounded"
          />
          {formErrors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors[field.name]}
            </p>
          )}
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formType || "Form"}</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-200 rounded w-full"
                ></div>
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded w-full"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {fileAttachments?.map(renderFile)}
            {formSchema?.map(renderField)}
            {error && (
              <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-3 mb-4 rounded-md">
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      <button
        onClick={handleClose}
        className="absolute transition-all duration-300 ease-in-out top-[40px] right-[1px] sm:top-[40px] sm:right-[1px] md:top-[40px] md:right-[calc(50%-400px)] lg:top-[50px] lg:right-[calc(50%-450px)] xl:top-[50px] xl:right-[calc(50%-500px)] bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-red-300 shadow-md z-20"
        style={{ lineHeight: "0" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </button>
    </div>
  );
};

export default Modal;
