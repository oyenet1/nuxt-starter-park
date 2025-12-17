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
      <title>Welcome to Our Newsletter</title>
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
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        <div class="content">
          <p>Hi ${name || "there"},</p>
          <p>Thank you for subscribing to our newsletter. You'll receive the latest updates and news from SupaNuxt.</p>
          <p>Stay tuned for exciting content!</p>
          <a href="${
            process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000"
          }" class="button">Visit Our Site</a>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
          <p>You can unsubscribe at any time.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
    to: [email],
    subject: "Welcome to Our Newsletter",
    html,
  });

  if (response.error) {
    throw createError({
      statusCode: 500,
      message: "Error sending newsletter email",
    });
  }

  return { success: true };
});
