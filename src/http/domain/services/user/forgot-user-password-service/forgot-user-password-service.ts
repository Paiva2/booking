import { randomUUID } from 'node:crypto';
import { UserRepository } from '../../../../data/repositories';
import { InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';
import { SendMailEntity } from '../../../entities';
import { emailValidator } from '../../../utils';
import { EmailSender, Encrypter, Service } from '../../../protocols';

export class ForgotUserPasswordService implements Service {
  public constructor(
    private readonly mailSender: EmailSender,
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  public async exec(email: string): Promise<SendMailEntity> {
    if (!this.emailCheck(email)) {
      throw new InvalidParamException('email');
    }

    const doesUserExists = await this.userRepository.findByEmail(email);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const randomNewPassword = this.randomPassword();

    const hashNewPassword = await this.encrypter.hash(randomNewPassword);

    await this.userRepository.update({
      userId: doesUserExists.id,
      password: hashNewPassword,
    });

    const sendNewPasswordToEmail = this.mailSender.send({
      to: email,
      subject: '[Booking APP] - Password reset',
      text:
      `Hi ${doesUserExists.name}, here's your new password to use on login: ${randomNewPassword}\n 
      Don't forget to store your new password on a safe place!`,
    });

    return sendNewPasswordToEmail;
  }

  emailCheck(email: string): boolean {
    return emailValidator(email);
  }

  randomPassword() {
    return randomUUID().slice(0, 26).replaceAll('-', '');
  }
}
