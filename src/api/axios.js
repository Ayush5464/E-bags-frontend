import axios from "axios";

const API = axios.create({
  baseURL: "https://e-bags-backend.onrender.com/ebagmart",
  withCredentials: true, // needed for cookies
});

export default API;
