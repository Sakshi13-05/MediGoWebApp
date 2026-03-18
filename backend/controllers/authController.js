import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailSender.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 1. Request OTP Logic
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Upsert OTP (Expires in 5 mins - handled by TTL index if exists, otherwise manual check)
    await Otp.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true, new: true });

    // Send the actual email
    await sendEmail(email, otp);

    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      isNewUser: !user,
      message: "OTP sent successfully to email"
    });

  } catch (err) {
    console.error("OTP Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// 2. Verify OTP Logic
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is correct! Clear it from DB
    await Otp.deleteOne({ _id: record._id });

    const user = await User.findOne({ email });

    if (user) {
      // Existing User - Login immediately
      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // New User - Move to Step 3 (Onboarding)
      return res.status(200).json({
        success: true,
        isNewUser: true,
        message: "Email verified. Please complete onboarding."
      });
    }
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "Server error during verification" });
  }
};

// 3. Onboarding Logic
export const onboardUser = async (req, res) => {
  const { email, name, mobile, userCategory } = req.body;

  try {
    // Check if user already exists (safety check)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create new user
    user = new User({
      email,
      name,
      mobile,
      userCategory,
      isVerified: true
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Onboarding complete",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Onboarding Error:", err);
    res.status(500).json({ success: false, message: "Failed to complete onboarding" });
  }
};