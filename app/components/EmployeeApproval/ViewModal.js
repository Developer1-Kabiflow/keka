import { useState, useEffect, useRef, useCallback } from "react";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";
import { downloadFile, getMyFormData } from "@/app/controllers/formController";
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
  const [isSharing, setIsSharing] = useState(false);

  const fetchForm = useCallback(async () => {
    if (isOpen && requestId) {
      setLoading(true);
      try {
        const { requestData, approvalData } = await getMyFormData(requestId);
        const options = await showShareOption();

        if (options && Array.isArray(options)) {
          setShareOptions(options);
          setSelectedShareOption(options[0].sharingFlowId);
        } else {
          onToast("Failed to load share options.", "error");
        }
        setShareOptions(options);
        setFormData(requestData);
        setApprovalData(approvalData);
      } catch (err) {
        // Using error message from backend if available
        const errorMessage =
          err.response?.data?.message ||
          "Failed to load form data. Please try again.";
        onToast(errorMessage, "error");
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
    if (selectedShareOption === null) {
      onToast("Please select a role to share the request", "error");
      return;
    }
    setIsSharing(true);
    try {
      const success = await handleShare(
        requestId,
        approverId,
        selectedShareOption
      );
      if (success) {
        onToast("Request shared successfully.", "success");
        refreshData();
        handleClose();
      } else {
        onToast("Failed to share the request. Please try again.", "error");
      }
    } catch (err) {
      // Using error message from backend if available
      const errorMessage =
        err.response?.data?.message ||
        "Error sharing request. Please try again.";
      onToast(errorMessage, "error");
    } finally {
      setIsSharing(false);
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
      // Using error message from backend if available
      const errorMessage =
        err.response?.data?.message ||
        "Failed to Reject Request. Please try again.";
      onToast(errorMessage, "error");
    } finally {
      setRejecting(false);
    }
  };

  const handleDownload = async (fileUrl, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const downloadContent = await downloadFile(fileUrl);
      const blob = new Blob([downloadContent], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      const fileName = fileUrl.split("/").pop();
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href); // Cleanup after download
    } catch (error) {
      console.error("Error downloading file:", error);
      // Using error message from backend if available
      const errorMessage =
        error.response?.data?.message ||
        "Failed to download the file. Please try again.";
      onToast(errorMessage, "error");
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
      // Using error message from backend if available
      const errorMessage =
        err.response?.data?.message ||
        "Error during approval. Please try again.";
      onToast(errorMessage, "error");
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
                          onClick={(e) => handleDownload(file.url, e)}
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
                    <div className="absolute mt-2 w-full pb-10 z-10 max-h-60 overflow-y-auto">
                      <div
                        className={`p-2 ${
                          isOptionListOpen
                            ? "bg-blue-50 shadow-md rounded-lg"
                            : ""
                        }`}
                      >
                        <select
                          onChange={(e) => {
                            setSelectedShareOption(e.target.value);
                          }}
                          value={selectedShareOption}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {shareOptions.map((option) => (
                            <option
                              key={option.sharingFlowId}
                              value={option.sharingFlowId}
                            >
                              {option.roleName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Approve / Reject Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              {showRejectTextbox && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                    placeholder="Provide a reason for rejection"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleRejectClose}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejection}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      {rejecting ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={handleApproval}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                {approving ? "Approving..." : "Approve"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewModal;
