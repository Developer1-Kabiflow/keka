import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

import ViewModal from "./ViewModal";

import { fetchAllEmployeeRequests } from "@/app/controllers/requestController";

const TrackAllRequest = ({ employeeId }) => {
  const [allRequest, setAllRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const loadRequestData = async (employeeId) => {
    try {
      const { Allrequests, formTemplateData } = await fetchAllEmployeeRequests(
        employeeId
      );
      setAllRequest(Allrequests);

      console.log("display--> ", allRequest);
    } catch (err) {
      // setError(err.message || "Error fetching request data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the all employee requests
  useEffect(() => {
    const employeeId = Cookies.get("userId");
    if (employeeId) {
      loadRequestData(employeeId);
    }
  }, [employeeId]);

  const openViewModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRequestId(null);
  };

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
          {allRequest.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No request found
              </td>
            </tr>
          ) : (
            allRequest
              .slice()
              .reverse()
              .map((request, index) => (
                <tr key={request._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {request.request_name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(
                      request.date || request.created_at
                    ).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {request.status || "Pending"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => openViewModal(request.request_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      <div>
        <ViewModal
          isOpen={isViewModalOpen}
          handleClose={closeViewModal}
          requestId={selectedRequestId}
        />
      </div>
    </div>
  );
};

export default TrackAllRequest;
