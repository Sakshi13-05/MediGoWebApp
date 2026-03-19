import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) => {
  console.log("📨 Attempting to send OTP email to:", email);

  // Ensure EMAIL_PASS is a continuous string (trim spaces if any from env)
  const password = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  if (!process.env.EMAIL_USER || !password) {
    console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS environment variables are missing.");
    throw new Error("Server configuration error: Email credentials not found.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be a continuous 16-char App Password
      },
      tls: {
        // Prevents failure on cloud providers like Render/Google
        rejectUnauthorized: false
      },
      family: 4,
      connectionTimeout: 20000,
    });

    // Verification step
    await transporter.verify();
    console.log("✅ Transporter verified and ready");

    const mailOptions = {
      from: `"MediGo Healthcare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MediGo Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #00D09C; text-align: center;">Welcome to MediGo</h2>
          <p style="text-align: center;">Your verification security code is below. This code is valid for 5 minutes.</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 12px; color: #2D3436;">${otp}</span>
          </div>
          <p style="color: #636E72; font-size: 14px; text-align: center;">If you did not request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; font-size: 12px; color: #95A5A6;">&copy; 2026 MediGo Healthcare. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! ID:", info.messageId);

  } catch (error) {
    console.error("❌ NODEMAILER ERROR DETECTED:");
    console.dir(error, { depth: null }); // Comprehensive log for Render

    if (error.code === 'EAUTH') {
      throw new Error("Authentication Failed: Verify your GMAIL APP PASSWORD.");
    }
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
