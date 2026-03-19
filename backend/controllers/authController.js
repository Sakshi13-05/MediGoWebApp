import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailSender.js";
import jwt from "jsonwebtoken";

// 1. SEND OTP
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Atomic Upsert: Update if exists, else create
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
      message: "OTP sent successfully"
    });
  } catch (err) {
    console.error("❌ SEND OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Email failed to send" });
  }
};

// 2. VERIFY OTP (The Missing Function)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP matches
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Success! Clear OTP from DB immediately (One-time use)
    await Otp.deleteOne({ _id: record._id });

    // Check if user exists to handle the redirection
    const user = await User.findOne({ email });

    if (!user) {
      // New user: Tell frontend to show "Onboarding Form"
      return res.status(200).json({
        success: true,
        isNewUser: true,
        message: "Email verified. Please set up your profile."
      });
    }

    // Returning user: Issue JWT Token for persistent session
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Session lasts 7 days
    );

    res.status(200).json({
      success: true,
      isNewUser: false,
      token,
      user,
      message: "Login successful"
    });

  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 3. ONBOARD USER (Step 3)
export const onboardUser = async (req, res) => {
  try {
    const { email, name, mobile, state, userCategory } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, mobile, state, userCategory, isVerified: true },
      { new: true, upsert: true }
    ).lean();

    // Issue token for the new user
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      token,
      user: updatedUser,
      message: "Profile completed!"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};