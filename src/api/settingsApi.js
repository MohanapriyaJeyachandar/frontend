import axiosInstance from "../services/axios";

export const getSettings = async () => {
  const res = await axiosInstance.get("/settings");
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await axiosInstance.put("/settings", data);
  return res.data;
};