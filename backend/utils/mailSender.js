import nodemailer from 'nodemailer';

// 1. Stick to Named Export (matching your authController import)
export const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL/TLS for production security
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MediGo Healthcare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MediGo Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #00b894;">Welcome to MediGo</h2>
          <p>Please use the following One-Time Password (OTP) to verify your email. This code is valid for 5 minutes.</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #2d3436;">${otp}</span>
          </div>
          <p style="margin-top: 20px; color: #636e72; font-size: 12px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);

  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error.message);
    // FIX: Use capital 'Error' and pass the original message
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

// Remove 'export default' to avoid confusion if you are using { sendEmail } elsewhere