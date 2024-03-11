import {
  describe, expect, test, vi,
} from 'vitest';
import { RegisterUserController } from './register-user-controller';
import { RegisterUserService } from '../../domain/services/user/register-user-service/register-user-service';
import { MissingParamException } from '../../exceptions';

const makeRegisterUserService = () => new RegisterUserService();

const makeSut = () => {
  const userRegisterUserService = makeRegisterUserService();

  vi.spyOn(userRegisterUserService, 'exec').mockImplementation(async () => true);
  vi.spyOn(userRegisterUserService, 'emailCheck').mockImplementation(() => true);
  vi.spyOn(userRegisterUserService, 'postalCodeCheck').mockImplementation(() => true);
  vi.spyOn(userRegisterUserService, 'contactCheck').mockImplementation(() => true);

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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
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
      address: {
        street: 'valid_street',
        zipcode: 'valid_zipcode',
        neighbourhood: 'valid_neighbourhood',
        number: 'valid_number',
        complement: 'valid_complement',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    const response = await sut.handle({ body: requestBody });

    expect(response).toEqual({
      status: 200,
      data: 'Register sucessfull!',
    });
  });
});
