import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UpdateUserProfileController } from './update-user-profile-controller';
import { Service } from '../../../domain/protocols';
import { ClientUserEntity } from '../../../domain/entities';
import { JwtHandler } from '../../protocols';

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

const makeUpdateUserServiceStub = () => {
  class UpdateUserServiceStub implements Service {
    async exec(dto: any): Promise<ClientUserEntity> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        contact: 'any_contact',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        city: 'any_city',
        state: 'any_state',
        number: 'any_number',
        complement: 'any_complement',
        zipcode: 'any_zipcode',
      };
    }
  }

  return new UpdateUserServiceStub();
};

interface SutTypes {
  sut: UpdateUserProfileController
  updateUserServiceStub: Service
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutTypes => {
  const updateUserServiceStub = makeUpdateUserServiceStub();
  const jwtHandlerStub = makeJwtHandlerStub();

  const sut = new UpdateUserProfileController(updateUserServiceStub, jwtHandlerStub);

  return {
    sut,
    updateUserServiceStub,
    jwtHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('Update user profile controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call UpdateUserController handle method with correct provided args', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestArgs = {
      authorization: 'valid_token',
      body: {
        name: 'updated_name',
        email: 'updated_email@email.com',
      },
    };

    await sut.handle(requestArgs);

    expect(spySut).toHaveBeenCalledWith(requestArgs);
  });

  test('Should call JwtHandler decode method with correct provided args', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyJwtHandlerStub = vi.spyOn(jwtHandlerStub, 'decode');

    const requestArgs = {
      authorization: 'valid_token',
      body: {
        name: 'updated_name',
        email: 'updated_email@email.com',
      },
    };

    await sut.handle(requestArgs);

    expect(spyJwtHandlerStub).toHaveBeenCalledWith(requestArgs.authorization);
  });

  test('Should call UpdateUserService exec method with correct provided args', async () => {
    const { sut, updateUserServiceStub } = sutFactory;

    const spyUpdateUserServiceStub = vi.spyOn(updateUserServiceStub, 'exec');

    const requestArgs = {
      authorization: 'valid_token',
      body: {
        name: 'updated_name',
        email: 'updated_email@email.com',
      },
    };

    await sut.handle(requestArgs);

    expect(spyUpdateUserServiceStub).toHaveBeenCalledWith({
      userId: 'valid_subject',
      ...requestArgs.body,
    });
  });

  test('Should return ClientUserEntity with updated values if nothings goes wrong', async () => {
    const { sut, updateUserServiceStub } = sutFactory;

    const updatedClientEntity = {
      id: 'any_id',
      name: 'updated_name',
      email: 'updated_email@email.com',
      contact: 'any_contact',
      street: 'any_street',
      neighbourhood: 'any_neighbourhood',
      city: 'any_city',
      state: 'any_state',
      number: 'any_number',
      complement: 'any_complement',
      zipcode: 'any_zipcode',
    };

    vi.spyOn(updateUserServiceStub, 'exec').mockReturnValueOnce(Promise.resolve(updatedClientEntity));

    const requestArgs = {
      authorization: 'valid_token',
      body: {
        name: 'updated_name',
        email: 'updated_email@email.com',
      },
    };

    const response = await sut.handle(requestArgs);

    expect(response).toEqual({
      status: 200,
      data: updatedClientEntity,
    });
  });
});
