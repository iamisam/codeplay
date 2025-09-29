import axios from "axios";

const BASE_URL = "/api"; // This is the key!

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important for sending cookies
});

export default api;
