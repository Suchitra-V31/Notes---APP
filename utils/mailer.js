const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }

});

const sendLoginAttempt = async (toEmail,userId) => {
    const resetLink = "http://localhost:3000/notes/personal/"+ userId;
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: "⚠️ Alert: Suspicious Login Attempts Detected",
        text: "You’ve exceeded the maximum number of password attempts for your personal notes. If this wasn’t you, please reset your password immediately.",
        html: `
          <div style="font-family:sans-serif;line-height:1.5;">
            <h2 style="color:#D7263D;">⚠️ Suspicious Login Attempts</h2>
            <p>Hi,</p>
            <p>We detected <strong>3 failed</strong> password attempts on your personal notes with userID : <strong>${userId}</strong></p>
            <p>If this wasn’t you, please <a href="${resetLink}" style="color:#2B7A78;">reset your password</a> right away.</p>
            <p style="font-size:12px;color:#888;">This is an automated message — please do not reply.</p>
          </div>
        `
      };
      


    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Notification email sent to', toEmail);
    } catch (err) {
        console.error('❌ Failed to send email:', err);
    };
};
module.exports = sendLoginAttempt;