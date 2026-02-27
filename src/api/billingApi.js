import axiosInstance from "../services/axios";

export const getBillings = () => axiosInstance.get("/billing");

export const createBilling = (data) => axiosInstance.post("/billing", data);

export const updateBilling = (id, data) => axiosInstance.put(`/billing/${id}`, data);

export const deleteBilling = (id) => axiosInstance.delete(`/billing/${id}`);