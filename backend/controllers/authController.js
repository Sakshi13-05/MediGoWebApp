import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailSender.js";

// handles when back button is clicked
export const requestOTP = async () => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email is required" });
  // 1.gen otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    // save otp to db (upsert update if exist else create)
    await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });
    //  Check if user already exists (to tell frontend whether to show full form or just login)
    const user = await User.findOne({ email });
    res.status(200).json({
      success: true,
      isNewUser: !user,
      message: "OTP sent to email"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: error.message });

  }
}

export default verifyOTP = async () => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  // OTP is correct!
  await Otp.deleteOne({ _id: record._id }); // Delete after use
  res.status(200).json({ success: true, message: "Email verified!" });
}