import axiosInstance from "./axiosInstance";

export const getAllLeaveTypes = async () => {
  const response = await axiosInstance.get("/leave-types");
  return response.data;
};