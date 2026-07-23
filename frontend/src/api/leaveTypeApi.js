import axiosInstance from "./axiosInstance";

export const getAllLeaveTypes = async () => {
  const response = await axiosInstance.get("/leave-types");
  return response.data;
};

export const createLeaveType = async (leaveTypeData) => {
  const response = await axiosInstance.post("/leave-types", leaveTypeData);
  return response.data;
};

export const deactivateLeaveType = async (id) => {
  const response = await axiosInstance.put(`/leave-types/${id}/deactivate`);
  return response.data;
};