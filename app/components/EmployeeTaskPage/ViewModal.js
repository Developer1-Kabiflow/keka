"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BASE_URL from "@/utils/utils";
import ProgressStepsContainer from "./ProgressStepsContainer";

const ViewModal = ({ isOpen, handleClose, taskId, formTemplateId }) => {
  const [formSchema, setFormSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [showRejectTextbox, setShowRejectTextbox] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && formTemplateId) {
      axios
        .get(`${BASE_URL}/template/fetchForm/${formTemplateId}`)
        .then((response) => {
          setFormSchema(response.data);
          const initialData = response.data.data.reduce((acc, field) => {
            acc[field.name] = field.type === "checkbox" ? [] : "";
            return acc;
          }, {});
          setFormData(initialData);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, [isOpen, formTemplateId]);

  const handleRejectClick = () => {
    setShowRejectTextbox(true);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        const newValues = checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value);

        return { ...prevData, [name]: newValues };
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

    axios
      .post(`${BASE_URL}/request/addRequest/${taskId}`, submittedData)
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-500">Previous Approvals</h2>
          <button onClick={handleClose} className="text-red-600">&times;</button>
        </div>
        <ProgressStepsContainer />
        <form onSubmit={handleSubmit}>
          {formSchema.data?.map((field) => (
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
          <div className="flex justify-between">
            <button type="submit" className="bg-green-500 text-white rounded">Approve</button>
            <button type="button" onClick={handleRejectClick} className="bg-red-500 text-white rounded">Reject</button>
          </div>
          {showRejectTextbox && (
            <div className="mt-4">
              <textarea className="w-full p-2 border rounded" placeholder="Rejection reason"></textarea>
              <div className="flex mt-2 space-x-2">
                <button className="bg-blue-500 text-white rounded">Send</button>
                <button onClick={() => setShowRejectTextbox(false)} className="bg-gray-500 text-white rounded">Close</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ViewModal;
