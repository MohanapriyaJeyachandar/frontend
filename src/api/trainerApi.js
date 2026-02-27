import axiosInstance from "../services/axios";

export const getTrainers = () => axiosInstance.get("/trainers");

export const createTrainer = (data) => axiosInstance.post("/trainers", data);

export const updateTrainer = (id, data) => axiosInstance.put(`/trainers/${id}`, data);

export const deleteTrainer = (id) => axiosInstance.delete(`/trainers/${id}`);