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

  const formId = itemId;

  useEffect(() => {
    if (isOpen) {
      // Reset the form each time modal opens
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
            formSchema,
            formType,
            initialData,
            employeeData,
            attachments,
          } = await getProcessedFormSchema(formId, employeeId);
          setFormSchema(formSchema);
          setFormType(formType);
          setFormData(initialData);
          setEmployeeDetails(employeeData);
          setFileAttachments(attachments || []);
        } catch (err) {
          setError("Failed to load form schema. Please try again.");
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
      const regex = new RegExp(rule.pattern);
      if (!regex.test(value)) {
        return rule.message;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

      // Step 3: Submit form data
      formDataToSubmit.forEach((value, key) => {
        console.log("new formDataToSubmit==>>", key, value);
      });

      await handleFormSubmissionWithData(formId, formDataToSubmit);
      onToast("Created Request Successfully", "success");

      refreshData(); // Call refreshData from the grandparent
      handleClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    }
  };

  const handleFileChange = (event, index) => {
    const fileInput = event.target;
    const newFile = fileInput.files[0]; // Get the first file from the input

    if (!newFile) return; // Exit if no file is selected

    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = newFile; // Replace the file at the specific index
      return updatedFiles;
    });

    // Clear the file input value to allow re-uploading the same file
    fileInput.value = "";
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
          onChange={(e) => handleFileChange(e, index)} // Handle file change
          className="hidden" // Hide the default input
        />
        <label
          htmlFor={`file-upload-${index}`}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded cursor-pointer hover:bg-blue-600 focus:outline-none"
        >
          Choose File
        </label>
        <span className="text-sm text-gray-600 truncate max-w-xs">
          {selectedFiles[index]
            ? `Selected: ${selectedFiles[index].name}`
            : "No file chosen"}
        </span>
      </div>
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
                name={field.label}
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
              {formErrors[field.name]}
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
          <div className="text-center">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {fileAttachments.map(renderFile)}
            {formSchema.map(renderField)}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <button
        onClick={handleClose}
        className="absolute transition-all duration-300 ease-in-out top-[40px] right-[1px] sm:top-[40px] sm:right-[1px] md:top-[40px] md:right-[calc(50%-400px)] lg:top-[10px] lg:right-[calc(50%-480px)] text-white text-3xl font-semibold"
      >
        X
      </button>
    </div>
  );
};

export default Modal;
