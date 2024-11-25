import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all accepted for an employee
export const fetchAllRequests = async (approverId) => {
  try {
    console.log("fetchAllRequests approved by approver --> " + approverId);

    const response = await axios.get(
      `${BASE_URL}/trackApprovals/myApprovalsList/${approverId}`
    );
    // Extract and return only the data from the response
    return response.data; // Ensure you return the `data` property
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchApprovedRequests = async (approverId) => {
  try {
    console.log("fetching accepted requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myApprovedRequest/${approverId}`
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch rejected requests for an employee
export const fetchRejectedRequests = async (approverId) => {
  try {
    console.log("fetching rejected requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myRejectedRequest/${approverId}`
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch pending requests for an employee
export const fetchPendingRequests = async (approverId) => {
  try {
    console.log("fetching pending requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myInProgressRequest/${approverId}`
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const rejectRequest = async (approverId, requestId, rejectionNote) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/trackApprovals/myReject/${requestId}/${approverId}`,
      { rejectionNote } // Pass rejection note in the request body
    );

    // Check if the response status is 200 and return true or false
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error in handleReject:",
      error.response?.data?.message || error.message
    );
    return false; // Return false if there is any error
  }
};

export const approveRequest = async (approverId, requestId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/trackApprovals/myApprove/${requestId}/${approverId}`
    );

    // Check if the response status is 200 and return true or false
    return response.status === 200;
  } catch (error) {
    console.error(
      "Error in handleReject:",
      error.response?.data?.message || error.message
    );
    return false; // Return false if there is any error
  }
};
