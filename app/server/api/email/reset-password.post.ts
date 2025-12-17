import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, resetLink } = body;

  if (!email || !resetLink) {
    throw createError({
      statusCode: 400,
      message: "Email and resetLink are required",
    });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
        .header { background-color: #8B4513; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666; }
        .button { background-color: #8B4513; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>You requested a password reset for your SupaNuxt account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
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
    subject: "Reset Your Password",
    html,
  });

  if (response.error) {
    throw createError({
      statusCode: 500,
      message: "Error sending reset email",
    });
  }

  return { success: true };
});
