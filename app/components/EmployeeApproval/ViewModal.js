"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";
import {
  handleApprove,
  handleReject,
  showShareOption,
  handleShare,
} from "@/app/controllers/approvalController";
import Cookies from "js-cookie";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import ShareIcon from "@mui/icons-material/Share";
import IosShareIcon from "@mui/icons-material/IosShare";

const ViewModal = ({
  isOpen,
  handleClose,
  showAcceptReject,
  requestId,
  onToast,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [isOptionListOpen, setIsOptionListOpen] = useState(null);
  const [formData, setFormData] = useState({});
  const [approvalData, setApprovalData] = useState({});
  const [showRejectTextbox, setShowRejectTextbox] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const bottomRef = useRef(null);
  const progressStepsRef = useRef(null);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [approverId, setApproverId] = useState(null);
  const [shareOptions, setShareOptions] = useState([]);
  const [selectedShareOption, setSelectedShareOption] = useState(null);

  const fetchForm = useCallback(async () => {
    if (isOpen && requestId) {
      setLoading(true);
      try {
        const { requestData, approvalData } = await getMyFormData(requestId);
        const options = await showShareOption();

        if (options && Array.isArray(options)) {
          console.log("options", options);
          setShareOptions(options);
          setSelectedShareOption(options[0].sharingFlowId);
        } else {
          onToast("Failed to load share options.", "error");
        }
        console.log("optiions");
        console.dir(options);
        setShareOptions(options);
        setFormData(requestData);
        setApprovalData(approvalData);
      } catch (err) {
        onToast("Failed to load form data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, requestId, onToast]);

  useEffect(() => {
    let intervalId;

    const waitForUserId = () => {
      const approverId = Cookies.get("userId");
      if (approverId) {
        setApproverId(approverId);
        clearInterval(intervalId);
        fetchForm();
      }
    };
    intervalId = setInterval(waitForUserId, 500);
    return () => clearInterval(intervalId);
  }, [fetchForm]);

  const handleRejectClick = (e) => {
    e.preventDefault();

    setShowRejectTextbox(true);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000);
      })
      .catch((err) => console.error("Error copying URL to clipboard: ", err));
  };

  const handleRejectClose = () => setShowRejectTextbox(false);

  const handleShareSubmit = async () => {
    console.log("selectedShareOption-->" + selectedShareOption);
    if (selectedShareOption === null) {
      onToast("Please select a role to share the request", "error");
      return;
    }

    try {
      const success = await handleShare(
        requestId,
        approverId,
        selectedShareOption
      );
      if (success) {
        onToast("Request shared successfully.", "success");
      } else {
        onToast("Failed to share the request. Please try again.", "error");
      }
    } catch (err) {
      onToast("Error sharing request. Please try again.", "error");
    }
  };

  const handleRejection = async (e) => {
    e.preventDefault();

    if (!rejectionNote.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setRejecting(true);
    try {
      const isRejected = await handleReject(
        approverId,
        requestId,
        rejectionNote
      );
      if (isRejected) {
        onToast("Rejection successful.", "success");
        refreshData();
        handleClose();
      } else {
        onToast("Rejection failed. Please try again.", "error");
      }
    } catch (err) {
      onToast("Failed to Reject Request. Please try again.", "error");
    } finally {
      setRejecting(false);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const fileData = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileData);
      link.download = fileName;
      link.click();
    } catch (error) {
      onToast("Error downloading file. Please try again.", "error");
    }
  };

  const handleApproval = async (e) => {
    e.preventDefault();
    setApproving(true);
    try {
      const success = await handleApprove(approverId, requestId);
      if (success) {
        onToast("Approval successful.", "success");
        refreshData();
        handleClose();
      } else {
        onToast("Approval failed. Please try again.", "error");
      }
    } catch (err) {
      onToast("Error during approval. Please try again.", "error");
    } finally {
      setApproving(false);
    }
  };

  const isPdf = (url) => url.endsWith(".pdf");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl h-auto max-h-[85vh] overflow-y-auto shadow-xl">
        {/* Header Section */}
        <div className="flex justify-center gap-10 items-center mb-4">
          <span className="text-2xl font-semibold text-blue-600">
            Approval Request Details
          </span>
          <button
            onClick={copyUrlToClipboard}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ShareIcon fontSize="medium" />
          </button>
        </div>
        {isUrlCopied && (
          <p className="text-sm text-green-500 mb-4">
            URL copied to clipboard!
          </p>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-300 rounded w-full"
                ></div>
              ))}
            </div>
            <div className="h-48 bg-gray-300 rounded w-full"></div>
          </div>
        ) : (
          <>
            {/* Approval Steps */}
            <div className="mb-6">
              <ProgressStepsContainer approvalData={approvalData} />
            </div>

            {/* Form Fields */}
            <div className="mb-6">
              <form onSubmit={(e) => e.preventDefault()}>
                {formData?.fields?.map((field) => (
                  <div key={field._id} className="mb-4">
                    <label>{field.field_name}</label>
                    <input
                      type="text"
                      name={field.field_name}
                      placeholder={
                        formData?.[field.field_name] || field.field_value || ""
                      }
                      disabled
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                ))}
              </form>
            </div>

            {/* Uploaded Files */}
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
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Share Options */}
            {showAcceptReject && shareOptions?.length > 0 && (
              <div className="mt-6">
                <div className="relative">
                  <Tooltip title="Share the request with others for approval/rejection">
                    <button
                      onClick={() => {
                        setIsOptionListOpen((prev) => !prev);
                        setTimeout(
                          () =>
                            bottomRef.current?.scrollIntoView({
                              behavior: "smooth",
                            }),
                          0
                        );
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                      <IosShareIcon fontSize="small" />
                      Share
                    </button>
                  </Tooltip>

                  {/* Share Dropdown */}
                  {isOptionListOpen && (
                    <div className="absolute mt-2 w-full border rounded bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <select
                          onChange={(e) => {
                            setSelectedShareOption(e.target.value);
                          }}
                          value={selectedShareOption}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {/* Mapping over shareOptions */}
                          {shareOptions.map((option) => (
                            <option
                              key={option.sharingFlowId}
                              value={option.sharingFlowId}
                            >
                              {option.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="p-2 border-t flex justify-end">
                        <button
                          onClick={handleShareSubmit}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                          disabled={!selectedShareOption}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {showAcceptReject && !isOptionListOpen && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleApproval}
                  disabled={approving}
                  className={`px-6 py-3 rounded-lg font-medium text-white ${
                    approving
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } transition`}
                >
                  {approving ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={rejecting}
                  className={`px-6 py-3 rounded-lg font-medium text-white ${
                    rejecting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } transition`}
                >
                  {rejecting ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}

            {showRejectTextbox && (
              <div className="flex flex-col items-center mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-full">
                <textarea
                  placeholder="Please provide a reason for rejection..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition duration-200 resize-none"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  rows={4}
                />
                <div className="flex mt-4 gap-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-200"
                    onClick={handleRejection}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectClose}
                    className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg shadow hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef}></div>
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
