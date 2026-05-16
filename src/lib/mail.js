import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  const yesUrl = `${process.env.APP_URL}/api/verifyEmail/allow?token=${token}`;
  const noUrl = `${process.env.APP_URL}/api/verifyEmail/deny?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Was this you?",
    html: `
      <h2>Confirm your signup</h2>
      <p>We detected a signup attempt with your email.</p>

      <a href="${yesUrl}" 
         style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:5px;">
        ✅ Yes, it was me
      </a>

      <br/><br/>

      <a href="${noUrl}" 
         style="display:inline-block;padding:10px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:5px;">
        ❌ No, it wasn’t me
      </a>

      <p style="margin-top:20px;font-size:12px;color:#555;">
        This link expires in 10 minutes.
      </p>
    `,
  });
}
//
