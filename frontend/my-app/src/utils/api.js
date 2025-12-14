import axios from "axios";



export const api = axios.create({
  baseURL: "https://medigo-api-j1d7.onrender.com", 
});