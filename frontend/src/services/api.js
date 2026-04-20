import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

// 🔐 Attach token automatically
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
export const getQuestions = () => API.get("/questions");
export const getQuestionById = (id) => API.get(`/questions/${id}`);
export const getQuestionsByCompany = (company) =>
  API.get(`/questions/company/${company}`);
export const getQuestionsByTopic = (topic) =>
  API.get(`/questions/topic/${topic}`);
export const getQuestionsByDifficulty = (difficulty) =>
  API.get(`/questions/difficulty/${difficulty}`);
export const getFilteredQuestions = (filters) =>
  API.get("/questions/filter", { params: filters });
export const updateProfile = (data) =>
  API.put("/auth/update-profile", null, { params: data });
export const changePassword = (data) =>
  API.put("/auth/change-password", null, { params: data });
export const deleteAccount = () =>
  API.delete("/auth/delete-account");

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);