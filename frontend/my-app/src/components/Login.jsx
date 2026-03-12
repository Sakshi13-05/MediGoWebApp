import React, { useState } from "react";
import { api } from "../utils/api"; // ✅ Import the Cloud API helper
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope ,FaSpinner} from "react-icons/fa"; 
import "./Login.css"; 
import {toast} from 'react-toastify'

function Login({ setUser, closeLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1.basic Validation
    if(!form.email || !form.password){
      return toast.error("Please fill all the details");
    }
    setLoading(true);
    const endpoint=isRegistering? "/register":"/login"
    try{
        const res=await api.post(endpoint,form);

        if(isRegistering){
          console.log(res);
          toast.success("Registration Successful!!")
          setIsRegistering(false);
        }else{
          setUser(res.data.user);
          toast.success(`Welcome Back,${res.data.user.name}`);
          closeLogin();
          navigate("/");
        }
    }catch(e){
        const errMsg=e.response?.data?.message || "Server Error. Try again Later";
        toast.error(errMsg);
        setError(errMsg);
    }finally{
      setLoading(false);
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

        <button type="submit" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : (isRegistering ? "Register" : "Login")}
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