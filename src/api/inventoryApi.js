import axiosInstance from "../services/axios";

export const getInventory = () =>
  axiosInstance.get("/inventory");

export const createInventory = (data) =>
  axiosInstance.post("/inventory", data);

export const updateInventory = (id, data) =>
  axiosInstance.put(`/inventory/${id}`, data);

export const deleteInventory = (id) =>
  axiosInstance.delete(`/inventory/${id}`);