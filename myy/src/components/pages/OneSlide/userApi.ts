// userApi.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUsers = async () => {
  const response = await api.get("/users/");
  return response.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}/`);
};
