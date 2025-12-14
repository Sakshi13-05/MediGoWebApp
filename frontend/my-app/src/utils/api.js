import axios from "axios";

// ⚠️ HARDCODE THIS for the interview to ensure it works. 
// Do not use localhost here.
export const api = axios.create({
  baseURL: "https://medigo-api-j1d7.onrender.com", 
});