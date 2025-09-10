import axios from "axios";

const API = axios.create({
  baseURL: "https://e-bags-backend.onrender.com/ebagmart",
  withCredentials: true, // MUST be true to send cookies!
});

export default API;
