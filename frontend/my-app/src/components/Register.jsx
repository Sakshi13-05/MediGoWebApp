import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import { FiMail, FiUser, FiPhone, FiCheckCircle, FiChevronRight, FiMapPin } from "react-icons/fi";

const Register = ({ setUser }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Onboarding
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [onboarding, setOnboarding] = useState({
    name: "",
    mobile: "",
    state: "",
    userCategory: "Patient"
  });

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) return toast.error("Please enter email");
    setLoading(true);
    try {
      await api.post("/api/auth/send-otp", { email });
      setStep(2);
      toast.success("Security code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit code");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { email, otp });
      if (data.isNewUser) {
        setStep(3);
        toast.info("Complete your profile to continue");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}`);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async () => {
    if (!onboarding.name || !onboarding.mobile) return toast.error("Fill required fields");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/onboard", { 
        email, 
        ...onboarding 
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Profile verified!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reveal" style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="groww-card"
        style={{ padding: '40px' }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Welcome to MediGo</h2>
              <p style={{ color: '#636E72', marginBottom: '40px' }}>Enter your email to verify your identity</p>
              
              <div style={{ position: 'relative', marginBottom: '32px' }}>
                <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  className="input-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '48px', paddingRight: '80px' }}
                />
                <button 
                  onClick={handleSendOTP}
                  disabled={loading}
                  style={{ 
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#00D09C', fontWeight: 700, fontSize: '14px', background: 'none'
                  }}
                >
                  {loading ? "..." : "Verify"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Enter Code</h2>
              <p style={{ color: '#636E72', marginBottom: '40px' }}>We sent a 6-digit code to <b>{email}</b></p>
              
              <div style={{ marginBottom: '32px' }}>
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="••••••"
                  className="input-base"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '12px', fontSize: '24px', fontWeight: 800, color: '#00D09C' }}
                />
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOTP}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', height: '54px', borderRadius: '12px' }}
              >
                {loading ? "Verifying..." : "Continue"}
              </motion.button>
              
              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#636E72' }}>
                Didn't get it? <span style={{ color: '#00D09C', fontWeight: 600, cursor: 'pointer' }} onClick={handleSendOTP}>Resend</span>
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Final Step</h2>
              <p style={{ color: '#636E72', marginBottom: '32px' }}>Let's set up your healthcare profile</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                  <input 
                    type="text" placeholder="Full Name" className="input-base"
                    value={onboarding.name} style={{ paddingLeft: '48px' }}
                    onChange={(e) => setOnboarding({...onboarding, name: e.target.value})}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                  <input 
                    type="text" placeholder="Mobile Number" className="input-base"
                    value={onboarding.mobile} style={{ paddingLeft: '48px' }}
                    onChange={(e) => setOnboarding({...onboarding, mobile: e.target.value})}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <FiMapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                  <input 
                    type="text" placeholder="State" className="input-base"
                    value={onboarding.state} style={{ paddingLeft: '48px' }}
                    onChange={(e) => setOnboarding({...onboarding, state: e.target.value})}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="input-base"
                    value={onboarding.userCategory}
                    onChange={(e) => setOnboarding({...onboarding, userCategory: e.target.value})}
                    style={{ appearance: 'none' }}
                  >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Retailer">Retailer</option>
                  </select>
                  <FiChevronRight style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: '#95A5A6', pointerEvents: 'none' }} />
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleOnboarding}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', height: '54px', borderRadius: '12px' }}
              >
                {loading ? "Creating Profile..." : "Complete Setup"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Register;