import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiPhone, FiUser, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Onboarding
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [onboardingData, setOnboardingData] = useState({ name: '', mobile: '', userCategory: 'Patient' });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async () => {
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/send-otp', { email });
      setIsNewUser(response.data.isNewUser);
      setStep(2);
      setTimer(30);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      if (response.data.token) {
        // Existing user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}`);
        onClose();
      } else {
        // New user
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async () => {
    const { name, mobile, userCategory } = onboardingData;
    if (!name || !mobile) return toast.error('Please fill all details');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/onboard', { email, name, mobile, userCategory });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      toast.success('Registration successful!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="groww-card"
        style={{ width: '400px', padding: '32px', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', color: '#636E72', fontSize: '20px' }}>
          <FiX />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Login or Signup</h2>
              <p style={{ color: '#636E72', marginBottom: '32px', fontSize: '14px' }}>Please enter your email to continue</p>
              
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  className="input-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
                <button 
                  onClick={handleSendOTP}
                  style={{ 
                    position: 'absolute', right: '16px', top: '50%', 
                    transform: 'translateY(-50%)', color: '#00D09C', 
                    fontWeight: 600, fontSize: '14px' 
                  }}
                  disabled={loading}
                >
                  {loading ? '...' : 'Verify'}
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
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Enter OTP</h2>
              <p style={{ color: '#636E72', marginBottom: '32px', fontSize: '14px' }}>Sent to {email}</p>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="000000"
                  className="input-base"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 600 }}
                />
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginBottom: '16px' }}
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>

              <div style={{ textAlign: 'center' }}>
                {timer > 0 ? (
                  <p style={{ fontSize: '14px', color: '#636E72' }}>Resend OTP in {timer}s</p>
                ) : (
                  <button onClick={handleSendOTP} style={{ color: '#00D09C', fontSize: '14px', fontWeight: 600 }}>Resend OTP</button>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Welcome to MediGo!</h2>
              <p style={{ color: '#636E72', marginBottom: '32px', fontSize: '14px' }}>Just a few more details to set up your profile.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="input-base"
                    value={onboardingData.name}
                    onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                  <input 
                    type="text" 
                    placeholder="Mobile Number"
                    className="input-base"
                    value={onboardingData.mobile}
                    onChange={(e) => setOnboardingData({...onboardingData, mobile: e.target.value})}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
                <select 
                  className="input-base"
                  value={onboardingData.userCategory}
                  onChange={(e) => setOnboardingData({...onboardingData, userCategory: e.target.value})}
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Retailer">Retailer</option>
                </select>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={handleOnboarding}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Finish Setup'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthModal;
