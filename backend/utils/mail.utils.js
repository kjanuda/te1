import nodemailer from 'nodemailer';

export const sendEmail = async (dto) => {
  

  // Validate environment variables
  if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    throw new Error('Missing email configuration. Ensure MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASSWORD are set in .env');
  }

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_PORT === '465', // Use TLS for 587, SSL for 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production',
  });

  const { sender, recipients, subject, message, attachments } = dto;

  // Convert recipients to array of email addresses
  const to = recipients.map((recipient) => recipient.address);

  try {
    const response = await transport.sendMail({
      from: `${sender.name} <${sender.address}>`,
      to,
      subject,
      html: message,
      attachments,
    });
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};