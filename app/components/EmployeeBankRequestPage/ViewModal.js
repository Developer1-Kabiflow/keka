'use client';
import React, { useState, useEffect } from "react";
import BASE_URL from "@/utils/utils";
import axios from "axios";
import ProgressStepsContainer from "./ProgressStepsContainer";

const Modal = ({ isOpen, handleClose }) => {
  const [formSchema, setFormSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const formId = "671735d9d058568c8258da76";

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${BASE_URL}/template/fetchForm/${formId}`)
        .then((response) => {
          const schema = response.data;
          setFormSchema(schema);
          setFormType(schema.formType);
          setFormData(
            schema.data.reduce((acc, field) => {
              acc[field.name] = field.type === "checkbox" ? [] : "";
              return acc;
            }, {})
          );
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load form schema. Please try again.");
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = formSchema.data.reduce((acc, field) => {
      acc[field.name] = formData[field.name];
      return acc;
    }, {});

    submittedData.employeeId = "12345";
    submittedData.employeeName = "John Doe";

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
          <div />
          <h2 className="text-2xl font-semibold text-blue-600">Request Status</h2>
          <button
            onClick={handleClose}
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>

        <div className="bg-gray-50 p-4 mb-4">
          <h3 className="text-md text-blue-500 font-semibold mb-2">Approval Status</h3>
          <ProgressStepsContainer />
        </div>

        <h3 className="text-md font-semibold text-blue-500 mb-4">Submitted Form Details</h3>

        <form onSubmit={handleSubmit}>
          {formSchema.data && formSchema.data.map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-gray-700 mb-1">{field.placeholder}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="w-full px-3 py-2 border rounded"
                disabled={field.type === "checkbox"}
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
