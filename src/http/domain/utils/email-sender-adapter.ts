import { SendMailEntity } from '../entities';
import { EmailSender } from '../protocols';
import queues from '../lib/queues';

export class EmailSenderAdapter implements EmailSender {
  async send(mail: SendMailEntity): Promise<SendMailEntity> {
    await queues.mailQueue.add('mailQueue', mail);

    return mail;
  }
}
