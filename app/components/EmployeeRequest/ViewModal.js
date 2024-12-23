"use client";

import React, { useState, useEffect, useRef } from "react";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip"; // Tooltip for better UX
import ShareIcon from "@mui/icons-material/Share";
const ViewModal = ({ isOpen, handleClose, requestId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [approvalData, setApprovalData] = useState({});
  const [isUrlCopied, setIsUrlCopied] = useState(false); // State to track if URL is copied
  const progressStepsRef = useRef(null);

  // Define isPdf function inside the component scope
  const isPdf = (url) => url.endsWith(".pdf");

  // Using useEffect to fetch data when the modal is open and requestId is available
  useEffect(() => {
    const fetchForm = async () => {
      if (!isOpen || !requestId) return;

      setLoading(true);
      try {
        const { requestData, approvalData } = await getMyFormData(requestId);
        console.log();
        setFormData(requestData);
        setApprovalData(approvalData);
      } catch (err) {
        console.error("Error fetching form data", err);
        setError("Failed to load form schema. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm(); // Call the function on mount or when `requestId` or `isOpen` changes
  }, [isOpen, requestId]);

  const handleChange = (e) => {
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
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Optional: Extract filename from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsUrlCopied(true); // Set state to indicate URL has been copied
        setTimeout(() => setIsUrlCopied(false), 2000); // Reset the state after 2 seconds
      })
      .catch((err) => console.error("Error copying URL to clipboard: ", err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] max-h-[80vh] flex flex-col overflow-y-auto">
        <div className="flex justify-center gap-10 items-center mb-4">
          <span className="text-2xl font-semibold text-blue-600">
            Request Details
          </span>
          <button
            onClick={copyUrlToClipboard}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ShareIcon fontSize="medium" />
          </button>
        </div>

        {/* Show feedback when URL is copied */}
        {isUrlCopied && (
          <div className="text-green-500 text-sm mb-2">
            URL copied to clipboard!
          </div>
        )}

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
          <>
            <div className="flex flex-col w-full bg-gray-50 mb-4">
              <div className="w-full items-center" ref={progressStepsRef}>
                <ProgressStepsContainer approvalData={approvalData} />
              </div>
            </div>

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

            {/* Files Section */}
            {formData?.files?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.files.map((file) => (
                    <div
                      key={file._id}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Tooltip title="Open File" arrow>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {isPdf(file.url) ? (
                              <PictureAsPdfIcon fontSize="large" />
                            ) : (
                              <span className="text-sm font-semibold text-gray-800">
                                Open
                              </span>
                            )}
                          </a>
                        </Tooltip>
                        <span className="text-sm font-semibold text-gray-800">
                          {file.originalname}
                        </span>
                      </div>

                      <Tooltip title="Download File" arrow>
                        <button
                          onClick={() => handleDownload(file.url)}
                          className="text-black hover:bg-gray-300 py-2 px-4 rounded-md text-sm flex items-center justify-center gap-2"
                        >
                          <DownloadIcon fontSize="small" />
                          Download
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Close Button */}
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
