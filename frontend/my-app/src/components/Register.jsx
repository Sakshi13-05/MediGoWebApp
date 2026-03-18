import React, { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import { FiMail, FiUser, FiLock, FiCheckCircle } from "react-icons/fi";

function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [step, setStep] = useState(1);
  // 1.email 2.enter otp 3.Full form
  const [loading, setLoading] = useState(false);

  // Step1--send otp to gmail
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setStep(2);
      toast.success("Verification code sent to your email");
    } catch (err) {
      toast.error("Failed to send OTP. Check your connection.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // verify the code
  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      if (res.data.success) {
        setIsEmailVerified(true);
        setStep(3);
        toast.success("Email verified successfully!");
      }
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
      console.log(err);
    }
  };

  const isValidEmail = email.includes("@") && email.includes(".");

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      {/* --- STEP 1: EMAIL SECTION --- */}
      <div className="input-group">
        <label>Email Id*</label>
        <div className="input-row" style={{ position: "relative" }}>
          <FiMail className="input-icon" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isEmailVerified} // Lock email once verified
            style={{ paddingLeft: "35px", width: "100%", paddingRight: "80px", boxSizing: "border-box" }}
          />
          {isValidEmail && !isEmailVerified && step === 1 && (
            <button
              className="verify-btn"
              type="button"
              onClick={handleSendOtp}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
              disabled={loading}
            >
              {loading ? "..." : "Verify"}
            </button>
          )}
          {isEmailVerified && (
            <span className="verified-icon" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
              <FiCheckCircle /> Verified
            </span>
          )}
        </div>
      </div>

      {/* --- STEP 2: OTP INPUT (Shows only after clicking Verify) --- */}
      {step === 2 && (
        <div className="otp-section">
          <p>Please enter the 6-digit code sent to your email</p>
          <div className="input-row" style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              style={{ letterSpacing: "2px", textAlign: "center", flex: 1 }}
            />
            <button className="submit-main-btn" onClick={handleVerifyOtp} style={{ whiteSpace: "nowrap", margin: 0 }}>
              Submit OTP
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: FULL FORM (Shows only after Verification) --- */}
      {step === 3 && (
        <div className="full-form-animation">
          <div className="input-group">
            <label>Full Name*</label>
            <div className="input-row" style={{ position: "relative" }}>
              <FiUser className="input-icon" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As per official ID" 
                style={{ paddingLeft: "35px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password*</label>
            <div className="input-row" style={{ position: "relative" }}>
              <FiLock className="input-icon" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password" 
                style={{ paddingLeft: "35px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <button className="submit-main-btn" style={{ width: "100%", marginTop: "15px" }}>
            Complete Registration
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;