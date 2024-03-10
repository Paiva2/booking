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
});
