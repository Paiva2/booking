import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import {
  CreateUserEntity,
  SendMailEntity,
  UpdateUserEntity,
  UserEntity,
} from '../../../entities';
import { ForgotUserPasswordService } from '..';
import { EmailSender, Encrypter } from '../../../protocols';
import { UserRepository } from '../../../../data/repositories';
import { InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async hash(string: string): Promise<string> {
      return 'valid_hash';
    }

    async compare(base: string, encrypted: string): Promise<boolean> {
      return true;
    }
  }

  return new EncrypterStub();
};

const makeUserRepositoryStub = () => {
  const clientUserEntity = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
    contact: 'valid_contact',
    password: 'valid_hashed_password',
    neighbourhood: 'valid_neighbourhood',
    street: 'valid_street',
    city: 'valid_city',
    state: 'valid_state',
    number: 'valid_number',
    complement: 'valid_complement',
    zipcode: 'valid_zipcode',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class UserRepositoryStub implements UserRepository {
    async findByEmail(email: string): Promise<UserEntity | null> {
      return clientUserEntity;
    }

    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      return {
        ...clientUserEntity,
        password: 'valid_hashed_new_password',
      };
    }

    async save(_: CreateUserEntity): Promise<UserEntity> {
      return {} as UserEntity;
    }

    async findById(_: string): Promise<UserEntity | null> {
      return {} as UserEntity;
    }
  }

  return new UserRepositoryStub();
};

const makeMailSenderStub = () => {
  class MailSenderStub implements EmailSender {
    async send(mail: SendMailEntity): Promise<SendMailEntity> {
      return {
        to: 'any_to',
        subject: 'any_subject',
        text: 'any_text',
      };
    }
  }

  return new MailSenderStub();
};

interface SutType {
  sut: ForgotUserPasswordService
  encrypterStub: Encrypter
  userRepositoryStub: UserRepository
  mailSenderStub: EmailSender
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypterStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const mailSenderStub = makeMailSenderStub();

  const sut = new ForgotUserPasswordService(mailSenderStub, userRepositoryStub, encrypterStub);

  vi.spyOn(sut, 'emailCheck').mockReturnValue(true);

  return {
    sut,
    encrypterStub,
    userRepositoryStub,
    mailSenderStub,
  };
};

let sutFactory: SutType;

describe('Forgot user password controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ForgotUserPasswordService with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should call emailCheck method from SUT with correct provided params', async () => {
    const { sut } = sutFactory;

    const spyEmailCheck = vi.spyOn(sut, 'emailCheck');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spyEmailCheck).toHaveBeenCalledWith(requestBody);
  });

  test('Should throw an exception if provided email is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'emailCheck').mockReturnValueOnce(false);

    const requestBody = 'valid_email';

    const expectedExceptio = new InvalidParamException('email');

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedExceptio);
  });

  test('Should call UserRepository findByEmail method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findByEmail');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith(requestBody);
    expect(spyUserRepositoryStub).toHaveBeenCalledOnce();
  });

  test('Should throw an exception if User is not found', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null));

    const requestBody = 'valid_email';

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call Encrypter hash method with a new random password', async () => {
    const { sut, encrypterStub } = sutFactory;

    vi.spyOn(sut, 'randomPassword').mockReturnValueOnce('random_new_password');

    const spyEncrypterStub = vi.spyOn(encrypterStub, 'hash');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spyEncrypterStub).toHaveBeenCalledWith('random_new_password');
    expect(spyEncrypterStub).toHaveBeenCalledOnce();
  });

  test('Should call UserRepository update method with correct provided params', async () => {
    const { sut, encrypterStub } = sutFactory;

    vi.spyOn(sut, 'randomPassword').mockReturnValueOnce('random_new_password');

    const spyEncrypterStub = vi.spyOn(encrypterStub, 'hash');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spyEncrypterStub).toHaveBeenCalledWith('random_new_password');
    expect(spyEncrypterStub).toHaveBeenCalledOnce();
  });

  test('Should call EmailSender send method with correct provided params', async () => {
    const { sut, mailSenderStub } = sutFactory;

    vi.spyOn(sut, 'randomPassword').mockReturnValueOnce('random_new_password');

    const spyMailSenderStub = vi.spyOn(mailSenderStub, 'send');

    const requestBody = 'valid_email';

    await sut.exec(requestBody);

    expect(spyMailSenderStub).toHaveBeenCalledWith({
      to: requestBody,
      subject: '[Booking APP] - Password reset',
      text:
      `Hi valid_name, here's your new password to use on login: random_new_password\n 
      Don't forget to store your new password on a safe place!`,
    });
    expect(spyMailSenderStub).toHaveBeenCalledOnce();
  });

  test('Should return an SendMailEntity if nothing goes wrong', async () => {
    const { sut, mailSenderStub } = sutFactory;

    const requestBody = 'valid_email';

    const mailEntity = {
      to: requestBody,
      subject: '[Booking APP] - Password reset',
      text:
      `Hi valid_name, here's your new password to use on login: random_new_password\n 
      Don't forget to store your new password on a safe place!`,
    };

    vi.spyOn(sut, 'randomPassword').mockReturnValueOnce('random_new_password');

    vi.spyOn(mailSenderStub, 'send').mockReturnValueOnce(Promise.resolve(mailEntity));

    const response = await sut.exec(requestBody);

    expect(response).toEqual(mailEntity);
  });
});
