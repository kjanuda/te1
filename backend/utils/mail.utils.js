import nodemailer from 'nodemailer';

// const transpor = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: process.env.SMTP_PORT === "465", // Use secure for port 465 // Use secure connection if not in development
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// } as SMTPTransport.Options);



const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  debug: process.env.NODE_ENV !== 'production',
  logger: process.env.NODE_ENV !== 'production',
});

export const sendEmail = async (dto) => {
  const { sender, recipients, subject, message, attachments } = dto;

  return await transport.sendMail({
    from: sender,
    to: recipients,
    subject,
    html: `<p>${message}</p>`,
    attachments,
  });
};