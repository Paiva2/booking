import { SendMailEntity } from '../entities';

export interface EmailSender {
  send(mail: SendMailEntity): SendMailEntity
}
