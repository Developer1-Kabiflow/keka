"use client";
import { useEffect, useState } from "react";
import EmployeeSidebar from "../EmployeeSidebarPage/EmployeeSidebar";
import axios from "axios";
import BASE_URL from "@/utils/utils";
import ViewModal from "./ViewModal";
import CompletedViewModal from './CompletedViewModal'; 

const EmployeeTask = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending for approval");
  const [tasks, setTasks] = useState([]);
  const [workflowDetails, setWorkflowDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [selectedFormTemplateId, setSelectedFormTemplateId] = useState([]);
  const [isCompletedModalOpen, setCompletedModalOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const requests = [
    {
      id: 1,
      requestType: "Bank Name Change",
      requestDate: "2024-10-01",
      completedDate: "2024-10-05",
      status: "Completed",
      action: "View",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const approverId = "junior_002";
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/task/myTask/${approverId}`);
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleViewClick = ({ taskId, formTemplateId }) => {
    setSelectedTask(taskId);
    setSelectedFormTemplateId(formTemplateId);
    setIsModalOpen(true);
  };

  const handleCompletedViewClick = (request) => {
    setSelectedRequest(request);
    setCompletedModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const closeCompletedModal = () => {
    setCompletedModalOpen(false);
    setSelectedRequest(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Pending for approval":
        return (
          <div className="p-4 bg-white overflow-auto">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Request Type</th>
                  <th className="px-4 py-2">Request Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr key={task._id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{task.task_type}</td>
                      <td className="border px-4 py-2">
                        {new Date(task.task_date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{task.status}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() =>
                            handleViewClick({
                              taskId: task.pending_task,
                              formTemplateId: task.form_template_id,
                            })
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "Approved Requests":
        return (
          <div className="p-4 bg-white">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Request Type</th>
                  <th className="px-4 py-2">Request Date</th>
                  <th className="px-4 py-2">Completed Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={request.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{request.requestType}</td>
                    <td className="border px-4 py-2">{request.requestDate}</td>
                    <td className="border px-4 py-2">{request.completedDate}</td>
                    <td className="border px-4 py-2">{request.status}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleCompletedViewClick(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "Rejected Requests":
        return (
          <div className="p-4 bg-white">This is the Rejected Requests content.</div>
        );
      case "contacts":
        return (
          <div className="p-4 bg-white">This is the Contacts content.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <button
        onClick={toggleSidebar}
        className="md:hidden flex flex-col items-center justify-center p-4"
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 transition-transform ${
            isSidebarOpen ? "rotate-45" : ""
          }`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mb-1 ${isSidebarOpen ? "opacity-0" : ""}`}
        />
        <div
          className={`h-1 w-8 bg-blue-600 mt-1 transition-transform ${
            isSidebarOpen ? "-rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-gray-800 bg-opacity-75 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <EmployeeSidebar closeSidebar={toggleSidebar} />
      </div>

      <div className="hidden md:block">
        <EmployeeSidebar />
      </div>

      <div
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "ml-0" : "md:ml-0"
        }`}
      >
        <div className="container mx-auto px-4">
          <div>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("Pending for approval")}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === "Pending for approval"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Pending for approval
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("Approved Requests")}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === "Approved Requests"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Approved Requests
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("Rejected Requests")}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === "Rejected Requests"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Rejected Requests
                </a>
              </li>
              {/* <li className="me-2">
                <a
                  href="#"
                  onClick={() => setActiveTab("contacts")}
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === "contacts"
                      ? "text-blue-600 bg-white"
                      : "hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Contacts
                </a>
              </li> */}
            </ul>
          </div>

          {renderContent()}
        </div>
      </div>

      {isModalOpen && (
        <ViewModal
          taskId={selectedTask}
          formTemplateId={selectedFormTemplateId}
          closeModal={closeModal}
        />
      )}

      {isCompletedModalOpen && (
        <CompletedViewModal
          request={selectedRequest}
          closeModal={closeCompletedModal}
        />
      )}
    </div>
  );
};

export default EmployeeTask;
