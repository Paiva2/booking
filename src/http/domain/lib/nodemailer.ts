import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import 'dotenv/config';
import { SendMailEntity } from '../entities';

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

export function sendMail(mail: SendMailEntity) {
  const mailSuccess = new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    mailTransporter.sendMail(
      mail,
      async (err, info: SMTPTransport.SentMessageInfo) => {
        if (err) {
          reject(err);
        }

        resolve(info);
      },
    );
  });

  return mailSuccess;
}
