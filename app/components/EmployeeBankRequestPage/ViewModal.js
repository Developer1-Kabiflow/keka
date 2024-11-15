'use client';
import React, { useState, useEffect } from "react";
import BASE_URL from "@/utils/utils";
import axios from "axios";
import ProgressStepsContainer from "./ProgressStepsContainer";

const Modal = ({ isOpen, handleClose, employeeData }) => {
  const [formSchema, setFormSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const formId = "671735d9d058568c8258da76";
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
  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${BASE_URL}/template/fetchForm/${formId}`)
        .then((response) => {
          const schema = response.data;
          setFormSchema(schema);
          setFormType(schema.formType);
          
          const initialData = response.data.data.reduce((acc, field) => {
            acc[field.name] = field.type === "checkbox" ? [] : "";
            return acc;
          }, {});

          setFormData(initialData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setError("Failed to load form schema. Please try again.");
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
      <div className="flex justify-between items-center text-center mb-4">
        <div></div>
        <div>
          <span className="text-2xl font-semibold text-blue-600 ml-8">
            Request Status
          </span>
        </div>
        <div>
          <button
            onClick={handleClose}
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:text-gray-900"
            style={{ lineHeight: "0" }}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full bg-gray-50 h-36">
        {/* <img src={img1} className="w-full"></img> */}
        <div className="mt-2 mb-4 ml-2">
          <span className="text-md text-blue-500 font-semibold ">
            Approval Status
          </span>
        </div>
        <div className="w-full items-center ">
          <ProgressStepsContainer />
        </div>
      </div>
      <div className="flex mt-4 mb-4">
        <h2 className="text-md font-semibold text-blue-500">
          Submitted Form Details
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
     

      {fields?.map((field) => (
            <div key={field.name} className="mb-4">
              <label>{field.placeholder}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.value}
                value={formData[field.name] || ""}
                onChange={handleChange}
                disabled
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}

        {/* <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button> */}
      </form>

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  </div>
  );
};

export default Modal;
