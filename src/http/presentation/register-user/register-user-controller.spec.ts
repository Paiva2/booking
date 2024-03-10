import {
  describe, expect, test, vi,
} from 'vitest';
import { RegisterUserController } from './register-user-controller';
import { MissingParamException } from '../../exceptions/missing-param-exception';
import { RegisterUserService } from '../../domain/services/user/register-user-service';

const makeRegisterUserService = () => new RegisterUserService();

const makeSut = () => {
  const userRegisterUserService = makeRegisterUserService();

  const sut = new RegisterUserController(userRegisterUserService);

  return {
    sut,
    userRegisterUserService,
  };
};

describe('Register user controller', () => {
  test('Should throw exception if name is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      email: 'valid_email@email.com',
      password: 'valid_password',
      address: 'valid_address',
      contact: 'valid_contact',
    };

    const exception = sut.handle({ body: requestBody });

    const expectedException = new MissingParamException('name');

    await expect(exception).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if email is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      name: 'valid_name',
      password: 'valid_password',
      address: 'valid_address',
      contact: 'valid_contact',
    };

    const exception = sut.handle({ body: requestBody });

    const expectedException = new MissingParamException('email');

    await expect(exception).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if password is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      address: 'valid_address',
      contact: 'valid_contact',
    };

    const exception = sut.handle({ body: requestBody });

    const expectedException = new MissingParamException('password');

    await expect(exception).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if contact is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      address: 'valid_address',
    };

    const exception = sut.handle({ body: requestBody });

    const expectedException = new MissingParamException('contact');

    await expect(exception).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw exception if address is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
    };

    const exception = sut.handle({ body: requestBody });

    const expectedException = new MissingParamException('address');

    await expect(exception).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should call service with correct provided params', async () => {
    const { sut, userRegisterUserService } = makeSut();

    const userRegisterUserServiceSpy = vi.spyOn(userRegisterUserService, 'exec');

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: 'valid_address_obj',
    };

    await sut.handle({ body: requestBody });

    expect(userRegisterUserServiceSpy).toHaveBeenCalledWith(requestBody);
  });

  test('Should return 200 and data if nothing goes wrong', async () => {
    const { sut } = makeSut();

    const requestBody = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      contact: 'valid_contact',
      address: 'valid_address_obj',
    };

    const response = await sut.handle({ body: requestBody });

    expect(response).toEqual({
      status: 200,
      data: 'Register sucessfull!',
    });
  });
});
