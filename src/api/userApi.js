import axiosInstance from "../services/axios";

export const getUsers = () => axiosInstance.get("/employees");
export const createUser = (data) => axiosInstance.post("/employees", data);
export const deleteUser = (id) => axiosInstance.delete(`/employees/${id}`);