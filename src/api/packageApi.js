import axiosInstance from "../services/axios";

export const getPackages = () => axiosInstance.get("/packages");

export const createPackage = (data) => axiosInstance.post("/packages", data);

export const updatePackage = (id, data) => axiosInstance.put(`/packages/${id}`, data);

export const deletePackage = (id) => axiosInstance.delete(`/packages/${id}`);