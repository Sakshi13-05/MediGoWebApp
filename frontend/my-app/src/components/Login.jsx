import React, { useState } from "react";
import { api } from "../utils/api"; // ✅ Import the Cloud API helper
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; 
import "./Login.css"; 

function Login({ setUser, closeLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? "/register" : "/login";

    try {
      // ✅ CORRECT WAY: Use 'api.post' (It automatically uses the Render URL)
      const res = await api.post(endpoint, form);

      if (isRegistering) {
        alert("Registration Successful! Please Login.");
        setIsRegistering(false);
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        closeLogin();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Connection Failed");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
        
        {error && <p className="error-msg" style={{color: 'red'}}>{error}</p>}

        {isRegistering && (
          <div className="input-group">
            <FaUser />
            <input 
              type="text" name="name" placeholder="Full Name" 
              value={form.name} onChange={handleChange} required 
            />
          </div>
        )}

        <div className="input-group">
          <FaEnvelope />
          <input 
            type="email" name="email" placeholder="Email Address" 
            value={form.email} onChange={handleChange} required 
          />
        </div>

        <div className="input-group">
          <FaLock />
          <input 
            type="password" name="password" placeholder="Password" 
            value={form.password} onChange={handleChange} required 
          />
        </div>

        <button type="submit">
          {isRegistering ? "Register" : "Login"}
        </button>

        <p className="toggle-text" style={{marginTop: "10px", cursor: "pointer", color: "blue"}}>
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering 
              ? "Already have an account? Login here" 
              : "New to MediGo? Create an account"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;