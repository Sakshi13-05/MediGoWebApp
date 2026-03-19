import nodemailer from 'nodemailer';

export const sendEmail = async (email, otp) => {
  console.log("📨 Attempting to send OTP email to:", email);
  
  // Audit Env Variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS environment variables are missing.");
    throw new Error("Server configuration error: Email credentials not found.");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This MUST be an App Password, not a regular password
      },
      // Higher timeout for Render's potential network latency
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verification step to catch connection issues early
    console.log("🔍 Verifying SMTP transporter...");
    await transporter.verify();
    console.log("✅ Transporter is ready to send messages");

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

    console.log("📤 Sending mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! MessageId:", info.messageId);

  } catch (error) {
    console.error("❌ NODEMAILER ERROR DETECTED:");
    console.error("- Message:", error.message);
    console.error("- Code:", error.code);
    console.error("- Command:", error.command);
    // Log whole object for Render logs
    console.dir(error, { depth: null });
    
    if (error.code === 'EAUTH') {
      throw new Error("Email Authentication Failed: Ensure you are using a GMAIL APP PASSWORD, not your regular password.");
    }
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};