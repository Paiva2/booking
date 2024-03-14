import {
  describe, expect, test, vi, beforeEach,
} from 'vitest';
import { ForgotUserPasswordController } from './forgot-user-password-controller';
import { Service } from '../../../domain/protocols';
import { ClientUserEntity } from '../../../domain/entities';
import { MissingParamException } from '../../exceptions';

const makeForgotUserPasswordServiceStub = () => {
  class ForgotUserPasswordServiceStub implements Service {
    async exec(dto: any): Promise<ClientUserEntity> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        contact: 'any_contact',
        neighbourhood: 'any_neighbourhood',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        number: 'any_number',
        complement: 'any_complement',
        zipcode: 'any_zipcode',
      };
    }
  }

  return new ForgotUserPasswordServiceStub();
};

interface SutTypes {
  sut: ForgotUserPasswordController,
  forgotUserPasswordServiceStub: Service
}

const makeSut = (): SutTypes => {
  const forgotUserPasswordServiceStub = makeForgotUserPasswordServiceStub();
  const sut = new ForgotUserPasswordController(forgotUserPasswordServiceStub);

  return {
    sut,
    forgotUserPasswordServiceStub,
  };
};

let sutFactory: SutTypes;

describe('Forgot user password controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ForgotUserPasswordController with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestBody = {
      email: 'valid_email',
    };

    await sut.handle({ body: requestBody });

    expect(spySut).toHaveBeenCalledWith({ body: requestBody });
  });

  test('Should throw an exception if email is missing on params', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      email: '',
    };

    const expectedException = new MissingParamException('email');

    await expect(() => sut.handle({ body: requestBody })).rejects.toStrictEqual(expectedException);
  });

  test('Should call ForgotUserPasswordService exec method with correct provided params', async () => {
    const { sut, forgotUserPasswordServiceStub } = sutFactory;

    const spyForgotUserPasswordServiceStub = vi.spyOn(forgotUserPasswordServiceStub, 'exec');

    const requestBody = {
      email: 'valid_email',
    };

    await sut.handle({ body: requestBody });

    expect(spyForgotUserPasswordServiceStub).toHaveBeenCalledWith(requestBody.email);
  });

  test('Should return an message if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      email: 'valid_email',
    };

    const response = await sut.handle({ body: requestBody });

    expect(response).toEqual({
      status: 204,
      data: null,
    });
  });
});
