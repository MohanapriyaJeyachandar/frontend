import axiosInstance from "../services/axios";

const token = localStorage.getItem("token");

const config = { headers: { Authorization: `Bearer ${token}` } };

export const getMembers = async () => {
  const res = await axiosInstance.get("/attendance/members", config);
  return res.data;
};

export const getRecords = async () => {
  const res = await axiosInstance.get("/attendance/records", config);
  return res.data;
};

export const checkInMember = async (memberId, memberName) => {
  const res = await axiosInstance.post("/attendance/checkin", { memberId, memberName }, config);
  return res.data;
};

export const checkOutMember = async (recordId) => {
  const res = await axiosInstance.post(`/attendance/checkout/${recordId}`, {}, config);
  return res.data;
};

export const deleteRecord = async (recordId) => {
  const res = await axiosInstance.delete(`/attendance/delete/${recordId}`, config);
  return res.data;
};

export const getAttendanceRecords = async () => {
  const res = await axiosInstance.get("/attendance/records", config);
  return res.data;
};

