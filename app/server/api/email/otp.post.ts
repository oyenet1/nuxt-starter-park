import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, otp } = body;

  if (!email || !otp) {
    throw createError({
      statusCode: 400,
      message: "Email and OTP are required",
    });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your OTP Code</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
        .header { background-color: #8B4513; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        .otp { font-size: 24px; font-weight: bold; color: #8B4513; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your OTP Code</h1>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>Your one-time password (OTP) for SupaNuxt is:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
    to: [email],
    subject: "Your OTP Code",
    html,
  });

  if (response.error) {
    throw createError({
      statusCode: 500,
      message: "Error sending OTP email",
    });
  }

  return { success: true };
});
