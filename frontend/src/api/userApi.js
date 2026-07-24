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

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.put("/users/change-password", { currentPassword, newPassword });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

export const getCurrentUserInfo = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};