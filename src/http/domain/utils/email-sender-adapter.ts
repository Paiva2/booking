import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailEntity } from '../entities';
import { mailTransporter } from '../lib/nodemailer';
import { EmailSender } from '../protocols';

export class EmailSenderAdapter implements EmailSender {
  send(mail: SendMailEntity): SendMailEntity {
    mailTransporter.sendMail(mail, (err, info: SMTPTransport.SentMessageInfo) => {
      if (err) {
        console.log('Error while sending password mail...', mail.to);
      } else {
        console.log('Password mail sended successfully!', info.messageId);
      }
    });

    return mail;
  }
}
