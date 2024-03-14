import nodemailer from 'nodemailer';
import 'dotenv/config';

export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_MAIL_EMAIL,
    pass: process.env.GOOGLE_MAIL_APP_PASS,
  },
});
