import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Ensure you have react-icons installed, or remove the icons if it errors
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; 
import "./Login.css"; 

function Login({ setUser, closeLogin }) {
  // State to toggle between Login and Register
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

    // Decide which URL to hit based on the mode
    const endpoint = isRegistering ? "/register" : "/login";
    const url = `http://localhost:5000${endpoint}`;

    try {
      const res = await axios.post(url, form);

      if (isRegistering) {
        // If Registration successful, switch to login mode automatically
        alert("Registration Successful! Please Login.");
        setIsRegistering(false);
      } else {
        // If Login successful
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        closeLogin();
        navigate("/dashboard"); // Or "/" depending on your routes
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
        
        {error && <p className="error-msg" style={{color: 'red'}}>{error}</p>}

        {/* Show Name field ONLY if registering */}
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