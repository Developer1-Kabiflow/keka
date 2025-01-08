import axios from "axios";
import BASE_URL from "@/utils/utils";

// Fetch all accepted for an employee
export const fetchAllRequests = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackApprovals/myApprovalsList/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching all requests."
    );
  }
};

export const fetchApprovedRequests = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myApprovedRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching approved requests."
    );
  }
};

// Fetch rejected requests for an employee
export const fetchRejectedRequests = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myRejectedRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching rejected requests."
    );
  }
};

// Fetch pending requests for an employee
export const fetchPendingRequests = async (approverId, page) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trackRequest/myInProgressRequest/${approverId}?page=${page}&pageLimit=10`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching pending requests."
    );
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
    return new Error(
      error.response?.data?.message || "Error rejecting the request."
    );
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
    return new Error(
      error.response?.data?.message || "Error approving the request."
    );
  }
};

export const showShare = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/sharing/role`);

    return response.data;
  } catch (error) {
    return new Error(
      error.response?.data?.message || "Error fetching sharing roles."
    );
  }
};

export const submitShare = async (requestId, approverId, sharingFlowId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sharing/acceptSharing/${requestId}/${approverId}`,
      { sharingFlowId }
    );
    return response.status === 200;
  } catch (error) {
    return new Error(
      error.response?.data?.message || "Error submitting share request."
    );
  }
};
