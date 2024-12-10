"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";

const ViewModal = ({ isOpen, handleClose, requestId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [approvalData, setApprovalData] = useState({});

  const progressStepsRef = useRef(null); // Ref to progress steps container

  // Use useCallback to prevent unnecessary re-creation of fetchForm
  const fetchForm = useCallback(async () => {
    if (!isOpen || !requestId) return; // Skip fetch if modal is not open or requestId is not available

    setLoading(true);
    try {
      const { requestData, approvalData } = await getMyFormData(requestId);
      setFormData(requestData);
      setApprovalData(approvalData);
      console.log("approvalData");
      console.dir(approvalData);
    } catch (err) {
      setError("Failed to load form schema. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    fetchForm(); // Trigger the fetch operation whenever isOpen or requestId changes
  }, [fetchForm]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData };

      if (type === "checkbox") {
        updatedData[name] = checked
          ? [...(prevData[name] || []), value]
          : prevData[name].filter((item) => item !== value);
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Container */}
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] max-h-[80vh] flex flex-col overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-center items-center mb-4">
          <span className="text-2xl font-semibold text-blue-600">
            Request Details
          </span>
        </div>

        {loading ? (
          /* Skeletal Loader */
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
          <>
            {/* Progress Steps Container */}
            <div className="flex flex-col w-full bg-gray-50 mb-4">
              <div className="w-full items-center" ref={progressStepsRef}>
                <ProgressStepsContainer approvalData={approvalData} />
              </div>
            </div>

            {/* Form Content */}
            <div className="flex flex-col w-full bg-gray-50">
              <form>
                {formData?.fields?.map((field) => (
                  <div key={field._id} className="mb-4">
                    <label>{field.field_name}</label>
                    <input
                      type="text"
                      name={field.field_name}
                      placeholder={
                        formData?.[field.field_name] || field.field_value || ""
                      }
                      onChange={handleChange}
                      disabled
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                ))}
              </form>
            </div>
          </>
        )}

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Close Button Outside the Modal but Positioned Close */}
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

export default ViewModal;
