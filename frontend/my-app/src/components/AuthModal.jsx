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

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setEmail('');
        setOtp('');
      }, 300);
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/api/auth/send-otp', { email });
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
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}`);
        onClose();
      } else {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="login-overlay" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', zIndex: 1100,
          backdropFilter: 'blur(10px)',
          padding: '20px'
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="groww-card"
            style={{ width: '100%', maxWidth: '440px', padding: '40px', position: 'relative' }}
          >
            <motion.button 
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              style={{ position: 'absolute', right: '24px', top: '24px', color: '#636E72', fontSize: '24px', zIndex: 10 }}
            >
              <FiX />
            </motion.button>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Welcome to MediGo</h2>
                  <p style={{ color: '#636E72', marginBottom: '40px', fontSize: '15px' }}>Enter your email to login or create an account</p>
                  
                  <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6', fontSize: '18px' }} />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      className="input-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '48px' }}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ translateY: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary" 
                    style={{ width: '100%', height: '54px', borderRadius: '12px' }}
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>...</motion.div> : 'Continue'}
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Verify OTP</h2>
                  <p style={{ color: '#636E72', marginBottom: '40px', fontSize: '15px' }}>Enter high-security code sent to <b>{email}</b></p>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
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
                    whileHover={{ translateY: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary" 
                    style={{ width: '100%', height: '54px', borderRadius: '12px', marginBottom: '20px' }}
                    onClick={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Log In'}
                  </motion.button>

                  <div style={{ textAlign: 'center' }}>
                    {timer > 0 ? (
                      <p style={{ fontSize: '14px', color: '#636E72' }}>Resend available in <span style={{ color: '#2D3436', fontWeight: 600 }}>{timer}s</span></p>
                    ) : (
                      <button onClick={handleSendOTP} style={{ color: '#00D09C', fontSize: '14px', fontWeight: 600 }}>Resend Verification Code</button>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 700 }}>Almost there!</h2>
                  <p style={{ color: '#636E72', marginBottom: '40px', fontSize: '15px' }}>Help us personalize your healthcare experience.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ position: 'relative' }}>
                      <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        className="input-base"
                        value={onboardingData.name}
                        onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
                        style={{ paddingLeft: '48px' }}
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
                        style={{ paddingLeft: '48px' }}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <select 
                        className="input-base"
                        value={onboardingData.userCategory}
                        onChange={(e) => setOnboardingData({...onboardingData, userCategory: e.target.value})}
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
                    whileHover={{ translateY: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary" 
                    style={{ width: '100%', height: '54px', borderRadius: '12px' }}
                    onClick={handleOnboarding}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Finish Setup'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

