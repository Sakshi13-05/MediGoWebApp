import React, { useState } from "react";
import { toast } from "react-toastify";
import {api} from "../utils/api"

function Register(){
    const[email,setEmail]=useState("");
    const[otp,setOtp] =useState("");
    const[isEmailVerified,setIsEmailVerified]=useState(false);
    const[step,setStep]=useState(1);
    // 1.email 2.enter otp 3.Full form
    const [loading,setLoading]=useState(false);
    

    // Step1--send otp to gmail
    const handleSendOtp=async()=>{
        setLoading(true);
        try{
            await api.post("/auth/send-otp",{email});
            setStep(2);
            toast.success("Verification code send to your email");

        }catch(err){
            toast.error("Failed to send OTP.Check your connection.")
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    // verify the code
    const handleVerifyOtp=async()=>{
        try{
            const res=await api.post("/auth/verify-otp",{email,otp});
            if(res.data.success){
                setIsEmailVerified(true);
                setStep(3)
                toast.success("Email is verified sucessfully!!")
            }
        }catch(err){
            console.log("Invalid OYP.Please try it again");
            console.log(err);
        }
    }
    
    return(
    <div className="register-container">
      <h2>Create Account</h2>

      {/* --- EMAIL SECTION --- */}
      <div className="input-group">
        <label>Email Id*</label>
        <div className="input-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isEmailVerified} // Lock email once verified
          />
          {email.includes("@") && !isEmailVerified && step === 1 && (
            <button className="verify-btn" type="button" onClick={handleSendOtp}>
              {loading ? "..." : "Verify"}
            </button>
          )}
          {isEmailVerified && <span className="verified-icon">✅ Verified</span>}
        </div>
      </div>

      {/* --- STEP 2: OTP INPUT (Shows only after clicking Verify) --- */}
      {step === 2 && (
        <div className="otp-section">
          <p>Please enter the 6-digit code sent to your email</p>
          <input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Submit OTP</button>
        </div>
      )}

      {/* --- STEP 3: FULL FORM (Shows only after Verification) --- */}
      {step === 3 && (
        <div className="full-form-animation">
          <div className="input-group">
            <label>Full Name*</label>
            <input type="text" placeholder="As per official ID" />
          </div>
          <div className="input-group">
            <label>Mobile Number*</label>
            <input type="text" placeholder="+91 Enter mobile number" />
          </div>
          {/* Add your State and Category dropdowns here */}
          <button className="submit-main-btn">Register</button>
        </div>
      )}
    </div>
  );
}

export default Register;