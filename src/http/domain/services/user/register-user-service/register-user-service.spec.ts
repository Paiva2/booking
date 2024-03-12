import {
  describe, test, vi, expect,
} from 'vitest';
import { AlreadyExistsException, InvalidParamException } from '../../../../presentation/exceptions';
import { RegisterUserService } from './register-user-service';
import { Encrypter } from '../../../protocols';
import { InMemoryUserModel } from '../../../../data/in-memory/in-memory-user-model';

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

const makeUserRepository = () => new InMemoryUserModel();

const makeSut = () => {
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

describe('Register user Service', () => {
  test('Should call register user service with correct provided params', async () => {
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut, userRepositoryStub } = makeSut();

    vi.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(new Promise((resolve) => resolve({
      id: 'any_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      contact: 'valid_contact',
      password: 'hashed_password',
      neighbourhood: 'valid_neighbourhood',
      city: 'valid_city',
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
    const { sut, userRepositoryStub } = makeSut();

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
    const { sut } = makeSut();

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
