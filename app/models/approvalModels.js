import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all accepted for an employee
export const fetchAllRequests = async (approverId, page) => {
  try {
    console.log("Fetching requests for approver ID: " + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackApprovals/myApprovalsList/${approverId}?page=${page}&pageLimit=10`
    );
    console.log("API Response:", response.data); // Log the API response to check if it's in the expected format
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};

export const fetchApprovedRequests = async (approverId, page) => {
  try {
    console.log("fetching accepted requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myApprovedRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch rejected requests for an employee
export const fetchRejectedRequests = async (approverId, page) => {
  try {
    console.log("fetching rejected requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myRejectedRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching requests");
  }
};
// Fetch pending requests for an employee
export const fetchPendingRequests = async (approverId, page) => {
  try {
    console.log("fetching pending requests for approver-->" + approverId);
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myInProgressRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
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
