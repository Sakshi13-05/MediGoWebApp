import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailSender.js";
import jwt from "jsonwebtoken";

// 1. SEND OTP - Checks if user exists and sends 6-digit code
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Atomic Update or Insert (Expire after 5 mins handled by DB index if exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp);

    const user = await User.findOne({ email });
    
    res.status(200).json({
      success: true,
      isNewUser: !user,
      message: "Security code sent to your email"
    });

  } catch (err) {
    console.error("❌ REQUEST OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to send email. Check credentials." });
  }
};

// 2. VERIFY OTP - Issues token if existing, or verified flag if new
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Details missing" });

    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    // Success - Clear OTP immediately
    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });

    if (!user) {
      // New user path
      return res.status(200).json({
        success: true,
        isNewUser: true,
        verified: true,
        message: "Email verified. Complete your profile."
      });
    }

    // Existing user path - Return JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      isNewUser: false,
      token,
      user,
      message: `Welcome back, ${user.name}`
    });

  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 3. ONBOARD USER - Final step for new users
export const onboardUser = async (req, res) => {
  try {
    const { email, name, mobile, state, userCategory } = req.body;
    
    if (!email || !name || !mobile) {
      return res.status(400).json({ success: false, message: "Basic details required" });
    }

    // Create or update user
    const newUser = await User.findOneAndUpdate(
      { email },
      { name, mobile, state, userCategory, isVerified: true },
      { new: true, upsert: true }
    ).lean();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: newUser,
      message: "Account created successfully!"
    });

  } catch (err) {
    console.error("❌ ONBOARD ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};