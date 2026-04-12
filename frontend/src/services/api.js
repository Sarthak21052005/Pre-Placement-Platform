import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const registerAdmin = (data) => API.post("/admin/register", data);
export const loginAdmin = (data) => API.post("/admin/login", data);
export const getQuestionById = (id) => API.get(`/questions/${id}`);
export const getQuestions = (id) => API.get(`/questions`);
export const getQuestionsByCompany = (company) => API.get(`/questions/company/${company}`);
export const updateProfile = (data) =>
  API.put("/auth/update-profile", null, {
    params: data
  });

export const changePassword = (data) =>
  API.put("/auth/change-password", null, {
    params: data
  });

export const deleteAccount = () =>
  API.delete("/auth/delete-account");