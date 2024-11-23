'use client';
import React, { useState, useEffect } from "react";
import ProgressStepsContainer from "./ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";
const ViewModal = ({ isOpen, handleClose, requestId }) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
   const [approvalData,setApprovalData] = useState({});

//  console.log("requestId:", requestId);
  useEffect(() => {
    if (isOpen && requestId) {
      setLoading(true);
    
      const fetchForm = async () => {
        try {
          const { requestData, approvalData} = await getMyFormData(requestId);
          setFormData(requestData);
          setApprovalData(approvalData);
        } catch (err) {
          setError("Failed to load form schema. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchForm();
    }
  }, [isOpen, requestId]);
  // Log formData to see the updated state value
  // console.log("formData", formData);
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


  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
  {/* Modal Container */}
  <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] h-auto max-h-[80vh] overflow-y-auto">
    {/* Modal Content */}
    <div className="flex justify-center items-center mb-4">
      <span className="text-2xl font-semibold text-blue-600">
        Request Status
      </span>
    </div>
    <div className="flex flex-col w-full bg-gray-50 h-36 mb-4">
      <div className="mt-2 mb-4 ml-2">
        <span className="text-md text-blue-500 font-semibold">
          Approval Status
        </span>
      </div>
      <div className="w-full items-center">
        <ProgressStepsContainer approvalData={approvalData} />
      </div>
    </div>
    <div className="flex mt-4 mb-4">
      <h2 className="text-md font-semibold text-blue-500">
        Submitted Form Details
      </h2>
    </div>
    <form>
          {formData?.fields?.map((field) => (
            <div key={field._id} className="mb-4">
              <label>{field.field_name}</label>
              <input
                type="text"
                name={field.field_name}
                placeholder={field.field_name}
                value={formData?.[field.field_name] || field.field_value || ""}
                onChange={handleChange}
                disabled
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
        </form>
    {error && <div className="text-red-500 mt-2">{error}</div>}
  </div>

  {/* Close Button Outside the Modal but Positioned Close */}
  <button
    onClick={handleClose}
    className="absolute transition-all duration-300 ease-in-out 
              top-[40px] right-[1px] 
              sm:top-[40px] sm:right-[1px] 
              md:top-[40px] md:right-[calc(50%-400px)] 
              lg:top-[50px] lg:right-[calc(50%-450px)] 
              xl:top-[50px] xl:right-[calc(50%-500px)] 
              bg-blue-200 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-red-300 shadow-md z-20"
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

export default ViewModal;
