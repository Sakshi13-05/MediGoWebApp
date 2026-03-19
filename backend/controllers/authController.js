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
  console.log("📥 RECEIVED OTP REQUEST:", req.body);
  const { email } = req.body;

  if (!email) {
    console.warn("⚠️ OTP Request failed: Email is missing in req.body");
    return res.status(400).json({ 
      success: false, 
      message: "Email is required in the request body" 
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    console.log(`💾 DB: Attempting to save/update OTP for ${email}`);
    // Upsert OTP (Expires in 5 mins - handled by TTL index)
    const otpRecord = await Otp.findOneAndUpdate(
      { email }, 
      { otp, createdAt: new Date() }, 
      { upsert: true, new: true }
    );
    console.log("✅ DB: OTP record updated successfully:", otpRecord._id);

    console.log("📧 EMAIL: Triggering sendEmail utility...");
    // Send the actual email
    await sendEmail(email, otp);
    console.log("✅ EMAIL: sendEmail completed successfully");

    console.log("👤 USER: Checking if user exists for redirect logic...");
    const user = await User.findOne({ email });
    const isNewUser = !user;
    console.log(`ℹ️ USER: User is ${isNewUser ? 'NEW' : 'EXISTING'}`);

    res.status(200).json({
      success: true,
      isNewUser,
      message: "OTP sent successfully to email"
    });

  } catch (err) {
    console.error("🔥 CRITICAL 500 ERROR IN requestOTP:");
    console.error("- Error Name:", err.name);
    console.error("- Error Message:", err.message);
    if (err.stack) console.error("- Stack Trace:", err.stack);

    // Differentiate between config/external errors and coding errors
    const errorMessage = err.message.includes("Email") 
      ? "Failed to process email delivery. Please check server logs." 
      : "Internal Server Error in OTP generation.";

    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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