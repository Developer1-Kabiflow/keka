"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  downloadFile,
  getTaskFormSchema,
  handleTaskFormSubmission,
} from "@/app/controllers/formController";
import Cookies from "js-cookie";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";
import ShareIcon from "@mui/icons-material/Share";
import { fetchProgress } from "@/app/controllers/taskController";
import ProgressStepsContainer from "../utils/ProgressStepsContainer";

const Modal = ({
  isOpen,
  handleClose,
  showSubmit,
  requestId,
  onToast,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [approverId, setApproverId] = useState(null);
  const [formData, setFormData] = useState([]);
  const [requestStatus, setRequestStatus] = useState();
  const [taskStatus, setTaskStatus] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [formAttachments, setFormAttachments] = useState([]);
  const [enabledField, setEnabledField] = useState([]);
  const [fileInputList, setFileInputList] = useState([]);
  const [enabledAttachments, setEnabledAttachments] = useState([]);
  const [error, setError] = useState(null); // Track error messages
  const progressStepsRef = useRef(null);

  const fetchForm = useCallback(
    async (id) => {
      if (isOpen && requestId) {
        setLoading(true);
        try {
          const {
            formData,
            formAttachments,
            enabledField,
            enabledAttachments,
            attachedFiles,
          } = await getTaskFormSchema(requestId, id);
          const { RequestData, TaskData } = await fetchProgress(requestId);
          setRequestStatus(RequestData);
          setTaskStatus(TaskData);
          setFormAttachments(attachedFiles);
          setEnabledField(enabledField);
          setFormData(formData);
          setEnabledAttachments(enabledAttachments);
          setFileInputList(formAttachments);
          console.dir(formData);
        } catch (err) {
          setError(
            err.message || "Failed to load form data. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [isOpen, requestId]
  );

  useEffect(() => {
    let intervalId;

    const waitForUserId = () => {
      const approverId = Cookies.get("userId");
      if (approverId) {
        setApproverId(approverId);
        clearInterval(intervalId);
        fetchForm(approverId);
      }
    };
    intervalId = setInterval(waitForUserId, 500);
    return () => clearInterval(intervalId);
  }, [fetchForm]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) =>
      prevData.map((field) =>
        field.field_name === name ? { ...field, field_value: value } : field
      )
    );
  };

  const handleFileChange = (event, index) => {
    const newFile = event.target.files[0];
    if (!newFile) return;
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = newFile;
      return updatedFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("EmployeeId", approverId);

      formData.forEach(({ field_name, field_value }) => {
        formDataToSubmit.append(field_name, field_value || "");
      });

      selectedFiles.forEach((file, index) => {
        if (file) {
          formDataToSubmit.append(`file_${index}`, file);
        }
      });

      await handleTaskFormSubmission(requestId, approverId, formDataToSubmit);
      onToast("Form submitted successfully!", "success");
      refreshData();
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to submit the form. Please try again."); // Set the error message
    } finally {
      setIsSubmitting(false);
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
      setError(
        error.message || "Failed to download the file. Please try again."
      ); // Set the error message
    }
  };

  const renderErrorBox = () => {
    if (!error) return null;

    return (
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
        <strong>Error: </strong>
        {error}
      </div>
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
      .catch((err) => setError("Failed to copy:" + err));
  };

  const renderUploadedFiles = () => (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {formAttachments.map((file) => (
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
                  {file.url?.endsWith(".pdf") ? (
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
  );

  const renderFileInput = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">File Attachments</h3>
        {fileInputList.map((attachment, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 mb-2">
              {attachment.field_name || `Attachment ${index + 1}`}
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, index)}
              className="w-full px-3 py-2 border rounded bg-gray-100"
              disabled={!enabledAttachments?.includes(attachment.field_name)}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-[600px] md:w-[800px] lg:w-[900px] xl:w-[1000px] h-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center gap-10 items-center mb-4">
          <span className="text-2xl font-semibold text-blue-600">
            Task Details
          </span>
          <button
            onClick={copyUrlToClipboard}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ShareIcon fontSize="medium" />
          </button>
        </div>
        {isUrlCopied && (
          <div className="text-green-500 text-sm mb-2">
            URL copied to clipboard!
          </div>
        )}
        {error ? (
          renderErrorBox()
        ) : loading ? (
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
            <span className="text-2xl font-semibold text-blue-600">
              Request Status
            </span>
            <div className="flex flex-col w-full bg-gray-50 mb-4">
              <div className="w-full items-center" ref={progressStepsRef}>
                <ProgressStepsContainer approvalData={requestStatus} />
              </div>
            </div>
            {taskStatus && (
              <>
                <span className="text-2xl font-semibold text-blue-600">
                  Task Status
                </span>
                <div className="flex flex-col w-full bg-gray-50 mb-4">
                  <div className="w-full items-center" ref={progressStepsRef}>
                    <ProgressStepsContainer approvalData={taskStatus} />
                  </div>
                </div>
              </>
            )}
            <form>
              {formData.map((field) => (
                <div key={field.field_name} className="mb-4">
                  <label className="block text-gray-700">
                    {field.field_display}:
                  </label>

                  {field.field_type === "select" ? (
                    // Dropdown
                    <select
                      name={field.field_name}
                      required={field.field_required}
                      value={field.field_value || ""}
                      onChange={(e) =>
                        handleInputChange(field.field_name, e.target.value)
                      }
                      disabled={!enabledField?.includes(field.field_label)}
                      className="w-full px-3 py-2 border rounded bg-gray-100"
                    >
                      <option value="" disabled>
                        {field.placeholder || "Select an option"}
                      </option>
                      {field.field_options?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.field_type === "radio" ? (
                    // Radio buttons
                    <div>
                      {field.options?.map((option, index) => (
                        <label
                          key={index}
                          className="inline-flex items-center mr-4"
                        >
                          <input
                            type="radio"
                            name={field.field_name}
                            value={option}
                            checked={field.field_value === option}
                            onChange={(e) =>
                              handleInputChange(
                                field.field_name,
                                e.target.value
                              )
                            }
                            disabled={
                              !enabledField?.includes(field.field_label)
                            }
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : field.field_type === "checkbox" ? (
                    // Checkboxes
                    <div>
                      {field.field_options?.map((option, index) => (
                        <label
                          key={index}
                          className="inline-flex items-center mr-4"
                        >
                          <input
                            type="checkbox"
                            name={field.field_name}
                            value={option}
                            checked={
                              Array.isArray(field.field_value)
                                ? field.field_value.includes(option) // For array
                                : field.field_value === option // For string
                            }
                            onChange={(e) => {
                              const valueArray = Array.isArray(
                                field.field_value
                              )
                                ? field.field_value
                                : [];
                              if (e.target.checked) {
                                handleInputChange(field.field_name, [
                                  ...valueArray,
                                  option,
                                ]);
                              } else {
                                handleInputChange(
                                  field.field_name,
                                  valueArray.filter((v) => v !== option)
                                );
                              }
                            }}
                            disabled={
                              !enabledField?.includes(field.field_label)
                            }
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    // Default input field
                    <input
                      type={field.field_type || "text"}
                      name={field.field_name}
                      required={field.field_required}
                      value={field.field_value || ""}
                      onChange={(e) =>
                        handleInputChange(field.field_name, e.target.value)
                      }
                      disabled={!enabledField?.includes(field.field_label)}
                      className="w-full px-3 py-2 border rounded bg-gray-100"
                    />
                  )}
                </div>
              ))}
              {fileInputList && fileInputList.length > 0 && renderFileInput()}
              {formAttachments &&
                formAttachments.length > 0 &&
                renderUploadedFiles()}
              {showSubmit && (
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </form>
          </>
        )}
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

export default Modal;
