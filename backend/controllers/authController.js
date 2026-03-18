import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailSender.js";

// 1. Request OTP Logic
export const requestOTP = async (req, res) => { // Added (req, res) here
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Upsert OTP
    await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });

    // Send the actual email
    await sendEmail(email, otp);

    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      isNewUser: !user,
      message: "OTP sent successfully to email"
    });

  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ success: false, message: err.message }); // Changed error to err
  }
};

// 2. Verify OTP Logic
export const verifyOTP = async (req, res) => { // Added (req, res) here
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is correct! Clear it from DB
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({
      success: true,
      message: "Email verified successfully!"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};