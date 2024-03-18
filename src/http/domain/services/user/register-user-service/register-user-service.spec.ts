import {
  describe,
  test, vi,
  expect,
  beforeEach,
} from 'vitest';
import { RegisterUserService } from './register-user-service';
import { Encrypter } from '../../../protocols';
import { UserRepository } from '../../../../data/repositories';
import { AlreadyExistsException, InvalidParamException } from '../../../../presentation/exceptions';
import { UserEntity, CreateUserEntity, UpdateUserEntity } from '../../../entities';

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async hash(_: string): Promise<string> {
      return 'hashed_password';
    }

    async compare(_: string, __: string): Promise<boolean> {
      return true;
    }
  }

  return new EncrypterStub();
};

const makeUserRepository = () => {
  const clientUserEntity = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    contact: 'valid_contact',
    password: 'hashed_password',
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
      return null;
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return clientUserEntity;
    }

    async findById(id: string): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }

    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }
  }

  return new UserRepositoryStub();
};

interface SutTypes {
  sut: RegisterUserService,
  userRepositoryStub: UserRepository
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepository();
  const encrypterStub = makeEncrypterStub();

  const sut = new RegisterUserService(userRepositoryStub, encrypterStub);

  vi.spyOn(sut, 'emailCheck').mockReturnValue(true);
  vi.spyOn(sut, 'contactCheck').mockReturnValue(true);
  vi.spyOn(sut, 'postalCodeCheck').mockReturnValue(true);

  return {
    sut,
    userRepositoryStub,
  };
};

let sutFactory: SutTypes;

describe('Register user Service', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call register user service with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    await sut.exec(requestBody);

    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should throw exception if email is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'emailCheck').mockReturnValueOnce(false);

    const requestBody = {
      name: 'valid_name',
      email: 'invalid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const expectedException = new InvalidParamException('email');

    await expect(() => sut.exec(requestBody)).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if zipcode is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'postalCodeCheck').mockReturnValueOnce(false);

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'invalid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const expectedException = new InvalidParamException('zipcode');

    await expect(() => sut.exec(requestBody)).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if contact is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'contactCheck').mockReturnValueOnce(false);

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'invalid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const expectedException = new InvalidParamException('contact');

    await expect(() => sut.exec(requestBody)).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if password length is not valid', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: '12345',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const expectedException = new InvalidParamException('password');

    await expect(() => sut.exec(requestBody)).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if user already exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 'any_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      contact: 'valid_contact',
      password: 'hashed_password',
      neighbourhood: 'valid_neighbourhood',
      city: 'valid_city',
      street: 'valid_street',
      state: 'valid_state',
      number: 'valid_number',
      complement: 'valid_complement',
      zipcode: 'valid_zipcode',
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const expectedException = new AlreadyExistsException('User');

    await expect(() => sut.exec(requestBody)).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(409);
  });

  test('Should call save method with hashed password', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'save');

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith({
      ...requestBody,
      password: 'hashed_password',
    });
  });

  test('Should return new created user it nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
        number: 'valid_number',
      },
    };

    const response = await sut.exec(requestBody);

    expect(response).toEqual({
      id: expect.any(String),
      name: 'valid_name',
      email: 'valid_email@email.com',
      contact: 'valid_contact',
      password: 'hashed_password',
      street: 'valid_street',
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
