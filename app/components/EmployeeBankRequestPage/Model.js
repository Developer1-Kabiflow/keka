'use client';
import { useState, useEffect } from "react";
import { getProcessedFormSchema, handleFormSubmissionWithData } from "@/app/controllers/formController";

const Modal = ({ isOpen, handleClose, employeeData }) => {
  const [formSchema, setFormSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formType, setFormType] = useState("");
  const formId = "671735d9d058568c8258da76";

  useEffect(() => {
    if (isOpen) {
      const fetchForm = async () => {
        try {
          const { formSchema, formType, initialData } = await getProcessedFormSchema(formId);
          setFormSchema(formSchema);
          setFormType(formType);
          setFormData(initialData);
          console.log("Form schema loaded successfully:", formSchema); 
        } catch (err) {
          console.error("Error fetching form schema:", err);
          setError("Failed to load form schema. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    }
  }, [isOpen,employeeData ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox"
        ? checked
          ? [...(prevData[name] || []), value]
          : (prevData[name] || []).filter((item) => item !== value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build the submitted data
    const submittedData = formSchema.data.reduce((acc, field) => {
      acc[field.name] = formData[field.name];
      return acc;
    }, {});

    submittedData.employeeId = employeeData?.employeeId || "12345"; // Ensure employeeId is passed correctly
    submittedData.employeeName = employeeData?.employeeName || "John Doe"; // Ensure employeeName is passed correctly
    console.log("Submitted Data:", submittedData);

      await handleFormSubmissionWithData(formId, submittedData);
      handleClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formType || "Form"}</h2>
          {/* <button
            onClick={handleClose}
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:text-gray-900"
            style={{ lineHeight: "0" }}
          >
            &times;
          </button> */}
        </div>

        <form onSubmit={handleSubmit}>
          {Array.isArray(formSchema.data) &&
            formSchema.data.map((field) => (
              <div className="mb-4" key={field.name}>
                <label className="block text-gray-700">{field.label}:</label>
                {field.type === "radio" ? (
                  field.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={formData[field.name] === option}
                        onChange={handleChange}
                        required={field.required}
                        className="mr-2"
                      />
                      <label className="text-gray-700">{option}</label>
                    </div>
                  ))
                ) : field.type === "checkbox" ? (
                  field.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        name={field.name}
                        value={option}
                        checked={formData[field.name]?.includes(option)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-gray-700">{option}</label>
                    </div>
                  ))
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    disabled={["employeeId", "employeeName"].includes(field.name)}
                    className="w-full px-3 py-2 border rounded"
                  />
                )}
              </div>
            ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>

        {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>

{/* Close Button Outside the Modal but Positioned Close */}
<button
  onClick={handleClose}
  className="absolute transition-all duration-300 ease-in-out 
            top-[30px] right-[1px] 
            sm:top-[40px] sm:right-[1px] 
            md:top-[40px] md:right-[calc(50%-400px)] 
            lg:top-[50px] lg:right-[calc(50%-450px)] 
            xl:top-[50px] xl:right-[calc(50%-470px)] 
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

export default Modal;
