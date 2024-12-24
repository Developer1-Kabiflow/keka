"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTaskFormSchema,
  handleTaskFormSubmission,
} from "@/app/controllers/formController";
import Cookies from "js-cookie";

const Modal = ({
  isOpen,
  handleClose,
  showSubmit,
  requestId,
  onToast,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({}); // Stores user input for the form
  const [formErrors, setFormErrors] = useState({}); // Stores validation errors
  const [formSchema, setFormSchema] = useState([]); // Stores form fields
  const approverId = Cookies.get("userId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Form Data
  const fetchForm = useCallback(async () => {
    if (isOpen && approverId) {
      setLoading(true);
      try {
        const { formSchema } = await getTaskFormSchema(requestId, approverId);
        setFormSchema(formSchema);
        setFormState(
          formSchema.reduce((acc, field) => {
            acc[field.field_name] = field.field_value || "";
            return acc;
          }, {})
        );
      } catch (err) {
        onToast("Failed to load form data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, approverId, onToast, requestId]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  // Validate a single field
  const validateField = (name, value, validations = []) => {
    for (const validation of validations) {
      if (validation.required && !value.trim()) {
        return `${validation.message || `${name} is required`}`;
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return `${validation.message || `${name} is invalid`}`;
      }
    }
    return null;
  };

  // Handle user input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Validate the field on change
    const fieldSchema = formSchema.find((field) => field.field_name === name);
    const error = validateField(name, value, fieldSchema?.validation || []);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate all fields
    const errors = formSchema.reduce((acc, field) => {
      const error = validateField(
        field.field_name,
        formState[field.field_name] || "",
        field.validation || []
      );
      if (error) {
        acc[field.field_name] = error;
      }
      return acc;
    }, {});

    setFormErrors(errors);

    // If errors exist, stop submission
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      onToast("Please fix the validation errors.", "error");
      return;
    }

    try {
      const result = await handleTaskFormSubmission(
        requestId,
        approverId,
        formState
      );
      if (result === true) {
        onToast("Form submitted successfully!", "success");
        refreshData();
        handleClose();
      } else {
        onToast("Failed to submit the form. Please try again.", "error");
      }
    } catch (err) {
      onToast("Failed to submit the form. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="text-2xl font-semibold text-center mb-4">
          Task Details
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formSchema.map((field) => (
              <div key={field.field_name}>
                <label className="block mb-1 font-medium">
                  {field.field_label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.field_name}
                  value={formState[field.field_name] || ""}
                  onChange={handleChange}
                  placeholder={field.field_placeholder}
                  disabled={field.isDisabled}
                  className={`w-full px-3 py-2 border rounded ${
                    formErrors[field.field_name] ? "border-red-500" : ""
                  }`}
                />
                {formErrors[field.field_name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[field.field_name]}
                  </p>
                )}
              </div>
            ))}

            {showSubmit && (
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
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
