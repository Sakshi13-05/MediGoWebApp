import axios from "axios";

export const api = axios.create({
  baseURL: "https://medigo-api-j1d7.onrender.com", 
});

// Interceptor is the one who assign the token to every request from local Storage
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
      config.headers.Authorization=`Bearer ${token}`
    }
    return config;
});

// if a user's token expires (e.g., they haven't logged in for 7 days), your backend will return a 401 Unauthorized error. A production app should catch this and force a logout.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear(); // Clear token
      window.location.href = "/"; // Force redirect to home/login
    }
    return Promise.reject(error);
  }
);