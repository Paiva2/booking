import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UpdateEstablishmentController } from './update-establishment-controller';
import { Service } from '../../../domain/protocols';
import { EstablishmentTypes } from '../../../domain/entities/enums';
import { HttpRequest, JwtHandler } from '../../protocols';
import { MissingParamException } from '../../exceptions';

const makeUpdateEstablishmentServiceStub = () => {
  class UpdateEstablishmentServiceStub implements Service {
    async exec(dto: any): Promise<any> {
      return {
        id: 'any_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        contact: 'any_contact',
        ownerId: 'any_ownerId',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        zipcode: 'any_zipcode',
        number: 'any_number',
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        complement: 'any_complement',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return new UpdateEstablishmentServiceStub();
};

const makeJwtHandlerStub = () => {
  class JwtHandlerStub implements JwtHandler {
    sign(subject: string): string {
      return 'valid_token';
    }

    decode(token: string): string {
      return 'valid_id';
    }
  }

  return new JwtHandlerStub();
};

interface SutTypes {
  sut: UpdateEstablishmentController
  updateEstablishmentServiceStub: Service
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutTypes => {
  const updateEstablishmentServiceStub = makeUpdateEstablishmentServiceStub();
  const jwtHandlerStub = makeJwtHandlerStub();

  const sut = new UpdateEstablishmentController(
    updateEstablishmentServiceStub,
    jwtHandlerStub,
  );

  return {
    sut,
    updateEstablishmentServiceStub,
    jwtHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('UpdateEstablishmentController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        name: 'valid_name',
        street: 'valid_street',
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(request);
  });

  test('Should throw Exception if no authorization header is present', async () => {
    const { sut } = sutFactory;

    const request: HttpRequest = {
      headers: {
        authorization: '',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        name: 'valid_name',
        street: 'valid_street',
      },
    };

    const expectedException = new MissingParamException('authToken');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should call JwtHandler decode method with correct provided params', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyHandler = vi.spyOn(jwtHandlerStub, 'decode');

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        name: 'valid_name',
        street: 'valid_street',
      },
    };

    await sut.handle(request);

    expect(spyHandler).toHaveBeenCalledOnce();
    expect(spyHandler).toHaveBeenCalledWith(request.headers.authorization);
  });

  test('Should call Service exec method with correct provided params', async () => {
    const { sut, updateEstablishmentServiceStub } = sutFactory;

    const spyService = vi.spyOn(updateEstablishmentServiceStub, 'exec');

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        name: 'valid_name',
        street: 'valid_street',
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledOnce();
    expect(spyService).toHaveBeenCalledWith({
      ownerId: 'valid_id',
      update: { ...request.body, id: request.params.establishmentId },
    });
  });

  test('Should return 201 and updated EstablishmentEntity if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        name: 'valid_name',
        street: 'valid_street',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 201,
      data: {
        id: 'any_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        contact: 'any_contact',
        ownerId: 'any_ownerId',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        zipcode: 'any_zipcode',
        number: 'any_number',
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        complement: 'any_complement',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
