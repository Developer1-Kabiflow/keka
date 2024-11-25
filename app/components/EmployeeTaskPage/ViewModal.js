"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ProgressStepsContainer from "../ProgressStepsContainer";
import { getMyFormData } from "@/app/controllers/formController";
import {
  handleApprove,
  handleReject,
} from "@/app/controllers/approvalController";

const ViewModal = ({
  isOpen,
  handleClose,
  showAcceptReject,
  requestId,
  onToast,
  refreshData,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [approvalData, setApprovalData] = useState({});
  const [approverId] = useState("E001");
  const [showRejectTextbox, setShowRejectTextbox] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const bottomRef = useRef(null);

  // Fetch Form Data
  const fetchForm = useCallback(async () => {
    if (isOpen && requestId) {
      setLoading(true);
      try {
        const { requestData, approvalData } = await getMyFormData(requestId);
        setFormData(requestData);
        setApprovalData(approvalData);
      } catch (err) {
        setError("Failed to load form data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
            ? [...(prevData[name] || []), value]
            : (prevData[name] || []).filter((item) => item !== value)
          : value,
    }));
  };

  // Handle Reject Button Click
  const handleRejectClick = () => {
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
    }
  };

  // Handle Approval
  const handleApproval = async (e) => {
    e.preventDefault();
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
      onToast("Failed to approve the request.", "error");
    }
  };

  // Return null if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-500">
            Previous Approvals
          </h2>
        </div>

        <div className="flex flex-col bg-gray-50 h-36 mb-4 p-4">
          <span className="text-md text-blue-500 font-semibold">
            Approval Status
          </span>
          <ProgressStepsContainer approvalData={approvalData} />
        </div>

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

          {showAcceptReject && (
            <div className="flex justify-between mx-48">
              <button
                type="submit"
                className="mt-4 px-4 py-2 w-24 bg-green-500 text-white rounded"
                onClick={handleApproval}
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
            </div>
          )}
        </form>

        {showRejectTextbox && (
          <div className="flex flex-col items-center mt-4">
            <textarea
              placeholder="Provide a reason for rejection"
              className="w-full p-2 border rounded"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
            />
            <div className="flex mt-2 space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleRejection}
              >
                Send
              </button>
              <button
                type="button"
                onClick={handleRejectClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
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
