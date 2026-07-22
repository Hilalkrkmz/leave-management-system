import axiosInstance from "./axiosInstance";

export const getMyLeaveRequests = async () => {
  const response = await axiosInstance.get("/leave-requests/my");
  return response.data;
};

export const createLeaveRequest = async (leaveRequestData) => {
  const response = await axiosInstance.post("/leave-requests", leaveRequestData);
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await axiosInstance.get("/leave-requests/pending");
  return response.data;
};

export const approveLeaveRequest = async (id) => {
  const response = await axiosInstance.put(`/leave-requests/${id}/approve`);
  return response.data;
};

export const rejectLeaveRequest = async (id, rejectionReason) => {
  const response = await axiosInstance.put(`/leave-requests/${id}/reject`, { rejectionReason });
  return response.data;
};