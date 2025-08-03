import axios from "axios";

const BASE_URL = "/api"; // This is the key!

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important for sending cookies
});
