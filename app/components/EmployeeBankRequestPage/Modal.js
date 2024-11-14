"use client";

import { useState, useEffect } from "react";
import BASE_URL from "@/utils/utils";
import axios from "axios";

const Modal = ({ isOpen, handleClose, employeeData }) => {
  const [formSchema, setFormSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const formId = '671735d9d058568c8258da76';

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${BASE_URL}/template/fetchForm/${formId}`)
        .then((response) => {
          console.log("Form Schema Data:", response.data); // Debug the response
          setFormSchema(response.data);
          setFormType(response.data.formType);

          const initialData = response.data.data.reduce((acc, field) => {
            // Initialize formData based on the field type
            if (field.type === "checkbox") {
              acc[field.name] = [];
            } else {
              acc[field.name] = "";
            }
            return acc;
          }, {});

          setFormData(initialData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching form data:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isOpen, employeeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        const newValues = checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value);

        return {
          ...prevData,
          [name]: newValues,
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the submitted data
    const submittedData = formSchema.data.reduce((acc, field) => {
      acc[field.name] = formData[field.name];
      return acc;
    }, {});

    submittedData.employeeId = employeeData?.employeeId || "12345"; // Ensure employeeId is passed correctly
    submittedData.employeeName = employeeData?.employeeName || "John Doe"; // Ensure employeeName is passed correctly

    console.log("Submitted Data:", submittedData);

    // Submit the form data
    axios
      .post(`${BASE_URL}/request/addRequest/${formId}`, submittedData)
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        handleClose();
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        setError("Failed to submit the form. Please try again.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formType || "Form"}</h2>
          <button
            onClick={handleClose}
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:text-gray-900"
            style={{ lineHeight: "0" }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {Array.isArray(formSchema.data) &&
            formSchema.data.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="block text-gray-700">{field.label}:</label>
                {field.type === "radio" ? (
                  field.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={formData[field.name] === option}
                        onChange={handleChange}
                        required={field.required}
                        className="mr-2"
                      />
                      <label className="text-gray-700">{option}</label>
                    </div>
                  ))
                ) : field.type === "checkbox" ? (
                  field.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        name={field.name}
                        value={option}
                        checked={formData[field.name].includes(option)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-gray-700">{option}</label>
                    </div>
                  ))
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    disabled={
                      ["employeeId", "employeeName"].includes(field.name)
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                )}
              </div>
            ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default Modal;
