import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"Riphah International College" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Admin Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a1128; color: #e2e8f0; border-radius: 12px;">
        <h2 style="color: #f5b041; margin-top: 0;">Password Reset Request</h2>
        <p>Use the OTP below to reset your admin password. It expires in <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #f5b041; background: rgba(245,176,65,0.1); padding: 16px 24px; border-radius: 8px; border: 1px solid rgba(245,176,65,0.3);">
            ${otp}
          </span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you did not request this, please ignore this email. Do not share this OTP with anyone.</p>
      </div>
    `,
  })
}
