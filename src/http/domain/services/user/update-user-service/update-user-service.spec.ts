import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UpdateUserService } from '..';
import { UserRepository } from '../../../../data/repositories';
import { UserEntity, CreateUserEntity, UpdateUserEntity } from '../../../entities';
import { AlreadyExistsException, InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';
import { Encrypter } from '../../../protocols';

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
  const mockUser = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
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
      return null;
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return {} as UserEntity;
    }

    async findById(id: string): Promise<UserEntity | null> {
      return mockUser;
    }

    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      return mockUser;
    }
  }

  return new UserRepositoryStub();
};

interface SutTypes {
  sut: UpdateUserService,
  userRepositoryStub: UserRepository,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const encrypterStub = makeEncrypterStub();

  const sut = new UpdateUserService(userRepositoryStub, encrypterStub);

  vi.spyOn(sut, 'emailCheck').mockReturnValue(true);
  vi.spyOn(sut, 'contactCheck').mockReturnValue(true);
  vi.spyOn(sut, 'postalCodeCheck').mockReturnValue(true);

  return {
    sut,
    userRepositoryStub,
    encrypterStub,
  };
};

let sutFactory: SutTypes;

describe('Update user profile controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call UpdateUserService exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const requestBody = {
      userId: 'valid_id',
      name: 'updated_name',
      email: 'valid_email',
    };

    await sut.exec(requestBody);

    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should throw an error if provided zipcode is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'postalCodeCheck').mockReturnValueOnce(false);

    const requestBody = {
      userId: 'valid_id',
      zipcode: 'invalid_zipcode',
    };

    const expectedException = new InvalidParamException('zipcode');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an error if provided contact is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'contactCheck').mockReturnValueOnce(false);

    const requestBody = {
      userId: 'valid_id',
      contact: 'invalid_contact',
    };

    const expectedException = new InvalidParamException('contact');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an error if provided email is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'emailCheck').mockReturnValueOnce(false);

    const requestBody = {
      userId: 'valid_id',
      email: 'invalid_email',
    };

    const expectedException = new InvalidParamException('email');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an error if provided password has less than 6 characters', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      userId: 'valid_id',
      password: '12345',
    };

    const expectedException = new InvalidParamException('password');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an error if provided userId doesnt exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null));

    const requestBody = {
      userId: 'valid_id',
    };

    const expectedException = new NotFoundException('User');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an error if provided DTO has an email and email already exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const existentUser = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'existent_email@email.com',
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

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(existentUser));

    const requestBody = {
      userId: 'valid_id',
      email: 'existent_email@email.com',
    };

    const expectedException = new AlreadyExistsException('E-mail');

    await expect(sut.exec(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call Encrypter hash method with correct provided params if new password is provided', async () => {
    const { sut, encrypterStub } = sutFactory;

    const spyEncrypterStub = vi.spyOn(encrypterStub, 'hash');

    const requestBody = {
      userId: 'valid_id',
      password: 'new_password',
    };

    await sut.exec(requestBody);

    expect(spyEncrypterStub).toHaveBeenCalledWith(requestBody.password);
  });

  test('Should call UserRepository findById method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findById');

    const requestBody = {
      userId: 'valid_id',
      password: 'new_password',
    };

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith(requestBody.userId);
  });

  test('Should call UserRepository findByEmail method with correct provided params if new email is provided', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findByEmail');

    const requestBody = {
      userId: 'valid_id',
      email: 'new_email',
    };

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith(requestBody.email);
  });

  test('Should hash a new password if password is provided and pass it to UserRepository update method', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'update');

    const requestBody = {
      userId: 'valid_id',
      password: 'new_password',
    };

    await sut.exec(requestBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith({
      ...requestBody,
      password: 'valid_hashed_password',
    });
  });

  test('Should return ClientUserEntity with updated infos if provided email was already mine', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const updatedClientUserEntity = {
      id: 'valid_id',
      name: 'new_name',
      email: 'new_email@email.com',
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

    const requestBody = {
      userId: 'valid_id',
      email: 'new_email@email.com',
      name: 'new_name',
    };

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(updatedClientUserEntity));
    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(updatedClientUserEntity));

    vi.spyOn(userRepositoryStub, 'update').mockReturnValueOnce(Promise.resolve(updatedClientUserEntity));

    const response = await sut.exec(requestBody);

    expect(response).toEqual(updatedClientUserEntity);
  });

  test('Should return ClientUserEntity with updated infos if nothing goes wrong', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const updatedClientUserEntity = {
      id: 'valid_id',
      name: 'new_name',
      email: 'new_email@email.com',
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

    const requestBody = {
      userId: 'valid_id',
      email: 'new_email@email.com',
      name: 'new_name',
    };

    vi.spyOn(userRepositoryStub, 'update').mockReturnValueOnce(Promise.resolve(updatedClientUserEntity));

    const response = await sut.exec(requestBody);

    expect(response).toEqual(updatedClientUserEntity);
  });
});
