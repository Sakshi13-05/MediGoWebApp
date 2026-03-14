import nodemailer from 'nodemailer'
const sendEmail=async(email,otp)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
      from: '"MediGo Healthcare" <no-reply@medigo.com>',
      to: email,
      subject: "MediGo Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #00b894;">Welcome to MediGo</h2>
          <p>Please use the following One-Time Password (OTP) to verify your email. This code is valid for 5 minutes.</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("email send to ",email);

    }catch(err){
        console.error(err);
        throw new err("failed to send email")
    }
}
export default sendEmail;