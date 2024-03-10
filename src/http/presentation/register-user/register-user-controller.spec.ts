import { describe, expect, test } from 'vitest';
import { RegisterUserController } from './register-user-controller';
import { MissingParamException } from '../../exceptions/missing-param-exception';

const makeSut = () => {
  const sut = new RegisterUserController();

  return {
    sut,
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
});
