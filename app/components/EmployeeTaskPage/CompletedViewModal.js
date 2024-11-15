"use client";  // Required to ensure client-side rendering for this component

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BASE_URL from "@/utils/utils";  // Ensure the URL is correctly configured for Next.js
import CompletedProgressStepsContainer from "./CompletedProgressStepsContainer ";

const ViewModal = ({
  isOpen,
  handleClose,
  employeeData,
  taskId,
  formTemplateId,
}) => {
  const [formSchema, setFormSchema] = useState({}); // Initialized as an object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const [showRejectTextbox, setShowRejectTextbox] = useState(false);
  
  const fields = [
    {
      name: "employeeId",
      value: "EMP0124",
      type: "text",
      placeholder: "Employee ID",
      required: true,
    },
    {
      name: "employeeName",
      value: "John Doe",
      type: "text",
      placeholder: "Employee Name",
      required: true,
    },
    {
      name: "currentBankName",
      value: "XYZ National Bank",
      type: "text",
      placeholder: "Current Bank Name",
      required: true,
    },
    {
      name: "newBankName",
      value: "ABC National Bank",
      type: "text",
      placeholder: "New Bank Name",
      required: true,
    },
    {
      name: "accountNumber",
      value: "ABC00100100110011",
      type: "text",
      placeholder: "Account Number",
      required: true,
    },
    {
      name: "branchName",
      value: "IJK",
      type: "text",
      placeholder: "Branch Name",
      required: true,
    },
    {
      name: "ifscCode",
      value: "IJKABC001",
      type: "text",
      placeholder: "IFSC Code",
      required: true,
    },
  ];

  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
    //   axios
    //     .get(`${BASE_URL}/template/fetchForm/${formTemplateId}`)
    //     .then((response) => {
    //       setFormSchema(response.data); 
    //       setFormType(response.data.formType);
    //       const initialData = response.data.data.reduce((acc, field) => {
    //         acc[field.name] = field.type === "checkbox" ? [] : "";
    //         return acc;
    //       }, {});

    //       setFormData(initialData);
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       setError(err.message);
    //       setLoading(false);
    //     });
    
    }
  }, [isOpen, formTemplateId]);

  const handleRejectClick = () => {
    setShowRejectTextbox(true);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleCloseClick = () => {
    setShowRejectTextbox(false);
  };

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

    const submittedData = fields.reduce((acc, field) => {
      acc[field.name] = formData[field.name];
      return acc;
    }, {});

    console.log("Submitted data:", submittedData);
    submittedData.employeeId = "12345";
    submittedData.employeeName = "John Doe";

    // axios
    //   .post(`${BASE_URL}/request/addRequest/${taskId}`, submittedData)
    //   .then((response) => {
    //     console.log("Form submitted successfully:", response.data);
    //     handleClose(); 
    //   })
    //   .catch((err) => {
    //     console.error("Error submitting form:", err);
    //     setError("Failed to submit the form. Please try again.");
    //   });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-500">Approvals Status</h2>
          <button
            onClick={handleClose}
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:text-gray-900"
            style={{ lineHeight: "0" }}
          >
            &times;
          </button>
        </div>
        <div className="flex justify-center items-center bg-gray-50 h-48">
          <CompletedProgressStepsContainer />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Submitted Form Details</h2>
          <form onSubmit={handleSubmit}>
            {/* {Array.isArray(formSchema.data) &&
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
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    disabled
                    // ={
                    //   field.name === "employeeId" || field.name === "employeeName"
                    // }
                    className="w-full px-3 py-2 border rounded"
                  />
                )}
              </div>
            ))} */}
            {fields.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="block text-gray-700">{field.placeholder}:</label>
                <input
                 key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.value}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  disabled
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
              {/* <div className="flex justify-between mr-48 ml-48">
              <button
                type="submit"
                className="mt-4 px-4 py-2 w-24 bg-green-500 text-white rounded"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={handleRejectClick}
                className="mt-4 px-4 py-2 w-24 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div> */}
            <div className="flex justify-center">
              {showRejectTextbox && (
                <div className="flex flex-col items-center mt-4 w-3/4">
                  <textarea
                    placeholder="Please provide a reason for rejection"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex mt-2 space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseClick}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ViewModal;
