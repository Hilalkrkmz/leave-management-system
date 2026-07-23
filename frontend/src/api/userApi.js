import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await axiosInstance.put(`/users/${id}/deactivate`);
  return response.data;
};

export const updateLeaveBalance = async (id, annualLeaveBalance) => {
  const response = await axiosInstance.put(`/users/${id}/leave-balance`, { annualLeaveBalance });
  return response.data;
};