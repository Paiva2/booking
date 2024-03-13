import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { AuthUserService } from '..';
import { Encrypter } from '../../../protocols';
import { CreateUserEntity, UserEntity } from '../../../entities';
import {
  InvalidParamException,
  NotFoundException,
  WrongCredentialsException,
} from '../../../../presentation/exceptions';
import { UserRepository } from '../../../../data/repositories';

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async hash(string: string): Promise<string> {
      return 'valid_hashed_password';
    }

    async compare(base: string, encrypted: string): Promise<boolean> {
      return true;
    }
  }

  return new EncrypterStub();
};

const makeUserRepositoryStub = () => {
  class UserRepositoryStub implements UserRepository {
    async findByEmail(email: string): Promise<UserEntity | null> {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        contact: 'valid_contact',
        password: 'valid_hashed_password',
        neighbourhood: 'valid_neighbourhood',
        city: 'valid_city',
        state: 'valid_state',
        number: 'valid_number',
        complement: 'valid_complement',
        zipcode: 'valid_zipcode',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        contact: 'valid_contact',
        password: 'valid_hashed_password',
        neighbourhood: 'valid_neighbourhood',
        city: 'valid_city',
        state: 'valid_state',
        number: 'valid_number',
        complement: 'valid_complement',
        zipcode: 'valid_zipcode',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return new UserRepositoryStub();
};

interface SutType {
  sut: AuthUserService;
  userRepositoryStub: UserRepository;
  encrypterStub: Encrypter;
}

const makeSut = () => {
  const encrypterStub = makeEncrypterStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const sut = new AuthUserService(userRepositoryStub, encrypterStub);

  vi.spyOn(sut, 'emailCheck').mockReturnValue(true);

  return {
    sut,
    userRepositoryStub,
    encrypterStub,
  };
};

let sutBuilder:SutType;

describe('Auth user service', () => {
  beforeEach(() => {
    sutBuilder = makeSut();
  });

  test('Should call AuthUserService with correct provided params', async () => {
    const { sut } = sutBuilder;

    const spySut = vi.spyOn(sut, 'exec');

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    await sut.exec(requestBody);

    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should throw an exception if email is invalid', async () => {
    const { sut } = sutBuilder;

    vi.spyOn(sut, 'emailCheck').mockReturnValueOnce(false);

    const requestBody = {
      email: 'invalid_email',
      password: 'valid_password',
    };

    const expectedException = new InvalidParamException('email');

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an exception if user doesnt exists', async () => {
    const { sut, userRepositoryStub } = sutBuilder;

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null));

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an exception if credentials are wrong', async () => {
    const { sut, encrypterStub } = sutBuilder;

    vi.spyOn(encrypterStub, 'compare').mockReturnValueOnce(Promise.resolve(false));

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'wrong_password',
    };

    const expectedException = new WrongCredentialsException();

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should return provided user if nothing goes wrong', async () => {
    const { sut, encrypterStub } = sutBuilder;

    vi.spyOn(encrypterStub, 'compare').mockReturnValueOnce(Promise.resolve(false));

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'wrong_password',
    };

    const expectedException = new WrongCredentialsException();

    await expect(() => sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should provide UserRepository findByEmail method correct provided params', async () => {
    const { sut, userRepositoryStub } = sutBuilder;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findByEmail');

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'wrong_password',
    };

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith(requestBody.email);
  });

  test('Should provide Encrypter compare method correct provided params', async () => {
    const { sut, encrypterStub } = sutBuilder;

    const spyEncrypterStub = vi.spyOn(encrypterStub, 'compare');

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'wrong_password',
    };

    await sut.exec(requestBody);

    expect(spyEncrypterStub).toHaveBeenCalledWith(requestBody.password, 'valid_hashed_password');
  });

  test('Should return provided user if nothing goes wrong', async () => {
    const { sut } = sutBuilder;

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'wrong_password',
    };

    const response = await sut.exec(requestBody);

    expect(response).toEqual({
      id: expect.any(String),
      name: 'valid_name',
      email: 'valid_email@email.com',
      contact: 'valid_contact',
      password: 'valid_hashed_password',
      neighbourhood: 'valid_neighbourhood',
      city: 'valid_city',
      state: 'valid_state',
      number: 'valid_number',
      complement: 'valid_complement',
      zipcode: 'valid_zipcode',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
