import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000"
});

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
export const getQuestionById = (id) => API.get(`/questions/${id}`);
export const getQuestions = (id) => API.get(`/questions`);
export const getQuestionsByCompany = (company) => API.get(`/questions/company/${company}`);