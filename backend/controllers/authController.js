// backend/controllers/authController.js
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Step 1: Received email:", email); // DEBUG

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Step 2: Generated OTP:", otp); // DEBUG

    // ATOMIC OPERATION
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    console.log("Step 3: Saved to DB"); // DEBUG

    await sendEmail(email, otp);
    console.log("Step 4: Email Sent"); // DEBUG

    res.status(200).json({ success: true, message: "OTP sent!" });

  } catch (err) {
    console.error("❌ ERROR IN OTP GEN:", err); // This shows in Render Logs
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};