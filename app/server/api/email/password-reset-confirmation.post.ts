import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, name } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Successful</title>
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
          <h1>Password Reset Successful</h1>
        </div>
        <div class="content">
          <p>Hi ${name || "there"},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
          <a href="${
            process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000"
          }/login" class="button">Login Now</a>
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
    subject: "Password Reset Successful",
    html,
  });

  if (response.error) {
    throw createError({
      statusCode: 500,
      message: "Error sending confirmation email",
    });
  }

  return { success: true };
});
