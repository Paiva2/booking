import {
  describe, expect, test, vi,
} from 'vitest';
import { Service } from '../../../domain/protocols';
import { JwtHandler } from '../../protocols';
import { AuthUserController } from './auth-user-controller';
import { AuthUserEntity, CreateUserEntity, UserEntity } from '../../../domain/entities';
import { MissingParamException } from '../../exceptions';
import { AuthUserService } from '../../../domain/services/user';

const makeJwtHandlerStub = () => {
  class JwtHandlerStub implements JwtHandler {
    sign(subject: string): string {
      return 'valid_token';
    }

    decode(token: string): string {
      return 'valid_subject';
    }
  }

  return new JwtHandlerStub();
};

const makeAuthUserServiceStub = () => {
  class AuthUserServiceStub implements Service {
    public async exec(dto: AuthUserEntity): Promise<UserEntity> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        contact: 'any_contact',
        password: 'any_password',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        city: 'any_city',
        state: 'any_state',
        number: 'any_number',
        complement: 'any_complement',
        zipcode: 'any_zipcode',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    emailCheck(email: string): boolean {
      return true;
    }
  }

  return new AuthUserServiceStub();
};

const makeSut = () => {
  const authUserServiceStub = makeAuthUserServiceStub();
  const jwtHandlerStub = makeJwtHandlerStub();

  const sut = new AuthUserController(authUserServiceStub, jwtHandlerStub);

  return {
    sut,
    jwtHandlerStub,
    authUserServiceStub,
  };
};

describe('Auth user controller', () => {
  test('Should throw MissingParamException if email is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      password: 'valid_password',
    };

    const expectedException = new MissingParamException('email');

    await expect(() => sut.handle({ body: requestBody })).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should throw MissingParamException if password is not provided', async () => {
    const { sut } = makeSut();

    const requestBody = {
      email: 'valid_email',
    };

    const expectedException = new MissingParamException('password');

    await expect(() => sut.handle({ body: requestBody })).rejects.toThrow(expectedException);
    expect(expectedException.status).toBe(400);
  });

  test('Should call SUT with correct provided params', async () => {
    const { sut } = makeSut();

    const spySut = vi.spyOn(sut, 'handle');

    const requestBody = {
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.handle({ body: requestBody });

    expect(spySut).toHaveBeenCalledWith({ body: requestBody });
  });

  test('Should call AuthUserService with correct provided params', async () => {
    const { sut, authUserServiceStub } = makeSut();

    const authUserServiceStubSpy = vi.spyOn(authUserServiceStub, 'exec');

    const requestBody = {
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.handle({ body: requestBody });

    expect(authUserServiceStubSpy).toHaveBeenCalledWith(requestBody);
  });

  test('Should call JwtHandler with correct provided params', async () => {
    const { sut, jwtHandlerStub } = makeSut();

    const jwtHandlerStubSpy = vi.spyOn(jwtHandlerStub, 'sign');

    const requestBody = {
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.handle({ body: requestBody });

    expect(jwtHandlerStubSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return auth token if nothing goes wrong', async () => {
    const { sut } = makeSut();

    const requestBody = {
      email: 'valid_email',
      password: 'valid_password',
    };

    const response = await sut.handle({ body: requestBody });

    expect(response).toEqual({
      status: 200,
      data: 'valid_token',
    });
  });
});
