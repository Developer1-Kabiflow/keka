"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";
import {
  handleApprove,
  handleReject,
} from "@/app/controllers/approvalController";
import Cookies from "js-cookie";

const ViewModal = ({
  isOpen,
  handleClose,
  showAcceptReject,
  requestId,
  onToast, // Toast handler passed from parent
  refreshData,
  formTemplateId,
}) => {
  const [loading, setLoading] = useState(false); // For fetching form data
  const [approving, setApproving] = useState(false); // For approving action
  const [rejecting, setRejecting] = useState(false); // For rejecting action
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [approvalData, setApprovalData] = useState({});
  const [showRejectTextbox, setShowRejectTextbox] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const bottomRef = useRef(null);
  const progressStepsRef = useRef(null);

  const approverId = Cookies.get("userId");
  console.log("showAcceptReject-->" + showAcceptReject);
  // Fetch Form Data
  const fetchForm = useCallback(async () => {
    if (isOpen && requestId) {
      setLoading(true); // Start loading before the request
      try {
        const { requestData, approvalData } = await getMyFormData(requestId);
        setFormData(requestData);
        setApprovalData(approvalData);
      } catch (err) {
        onToast("Failed to load form data. Please try again.", "error");
      } finally {
        setLoading(false); // End loading
      }
    }
  }, [isOpen, requestId, onToast]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  // Handle Reject Button Click
  const handleRejectClick = (e) => {
    e.preventDefault();
    setShowRejectTextbox(true);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  // Close Reject Textbox
  const handleRejectClose = () => setShowRejectTextbox(false);

  // Handle Rejection
  const handleRejection = async (e) => {
    e.preventDefault();

    if (!rejectionNote.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setRejecting(true); // Start rejection loading
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
      setRejecting(false); // End rejection loading
    }
  };

  // Handle Approval
  const handleApproval = async (e) => {
    e.preventDefault();
    setApproving(true); // Start approval loading
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
      setApproving(false); // End approval loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] h-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center items-center mb-4">
          <span className="text-2xl font-semibold text-blue-600">
            Task Details
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

                {showAcceptReject && (
                  <div className="flex flex-col sm:flex-row justify-center gap-6 sm:mx-48 mt-6">
                    <button
                      type="button"
                      disabled={approving}
                      className={`w-full sm:w-32 px-6 py-3 text-white font-semibold rounded-lg shadow-lg 
                           ${
                             approving
                               ? "bg-green-400 cursor-not-allowed"
                               : "bg-green-500 hover:bg-green-600"
                           }
                           transition duration-200 ease-in-out transform hover:scale-105`}
                      onClick={handleApproval}
                    >
                      {approving ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loader"></span> Approving...
                        </span>
                      ) : (
                        "Approve"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={rejecting}
                      onClick={handleRejectClick}
                      className={`w-full sm:w-32 px-6 py-3 text-white font-semibold rounded-lg shadow-lg 
                           ${
                             rejecting
                               ? "bg-red-400 cursor-not-allowed"
                               : "bg-red-500 hover:bg-red-600"
                           }
                           transition duration-200 ease-in-out transform hover:scale-105`}
                    >
                      {rejecting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loader"></span> Rejecting...
                        </span>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </>
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

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div ref={bottomRef} />
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

export default ViewModal;
