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
  const [employeeDetails, setEmployeeDetails] = useState("");

  const formId = itemId;

  useEffect(() => {
    if (isOpen) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const employeeId = Cookies.get("userId");
          const { formSchema, formType, initialData, employeeData } =
            await getProcessedFormSchema(formId, employeeId);

          setFormSchema(formSchema);
          setFormType(formType);
          setFormData(initialData);
          setEmployeeDetails(employeeData);
        } catch (err) {
          setError("Failed to load form schema. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    }
  }, [isOpen, formId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
            ? [...(prevData[name] || []), value]
            : (prevData[name] || []).filter((item) => item !== value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submittedData = formSchema.reduce((acc, field) => {
        if (field.disabled && employeeDetails && employeeDetails[field.label]) {
          acc[field.name] = employeeDetails[field.label] || "";
        } else {
          acc[field.name] = formData[field.name] || "";
        }
        return acc;
      }, {});

      console.log("Submitted data: ", submittedData);

      await handleFormSubmissionWithData(formId, submittedData);
      onToast("Created Request Successfully", "success");
      refreshData();
      handleClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      onToast("Failed to Create Request", "error");
      setError(err.message);
    }
  };

  const renderField = (field) => {
    if (field.type === "radio" || field.type === "checkbox") {
      return (
        <div className="mb-4" key={field.name}>
          <label className="block text-gray-700">{field.label}:</label>
          {field.options.map((option) => (
            <div key={option} className="flex items-center mb-2">
              <input
                type={field.type}
                name={field.name}
                value={option}
                checked={
                  field.type === "radio"
                    ? formData[field.name] === option
                    : formData[field.name]?.includes(option)
                }
                onChange={handleChange}
                required={field.required}
                className="mr-2"
              />
              <label className="text-gray-700">{option}</label>
            </div>
          ))}
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
              field.disabled && employeeDetails && employeeDetails[field.label]
                ? employeeDetails[field.label]
                : formData[field.name] || ""
            }
            onChange={handleChange}
            required={field.required}
            disabled={field.disabled}
            className="w-full px-3 py-2 border rounded"
          />
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
            {formSchema.map(renderField)}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-300 shadow-md z-20"
        aria-label="Close"
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
