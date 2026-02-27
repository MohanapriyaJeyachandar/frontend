import axiosInstance from "../services/axios";

export const getmembers = () => axiosInstance.get("/members");

export const createmembers = (data) => axiosInstance.post("/members", data);

export const updatemembers = (id, data) => axiosInstance.put(`/members/${id}`, data);

export const deletemembers = (id) => axiosInstance.delete(`/members/${id}`);
