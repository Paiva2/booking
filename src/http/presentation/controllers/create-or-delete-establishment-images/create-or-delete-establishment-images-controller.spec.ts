import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { CreateOrDeleteEstablishmentImagesController } from './create-or-delete-establishment-images-controller';
import { Service } from '../../../domain/protocols';
import { HttpRequest, JwtHandler } from '../../protocols';
import { MissingParamException } from '../../exceptions';

const makeJwtHandlerStub = () => {
  class JwtHandlerStub implements JwtHandler {
    sign(subject: string): string {
      return 'valid_token';
    }

    decode(token: string): string {
      return 'valid_subject_from_token';
    }
  }

  return new JwtHandlerStub();
};

const makeCreateOrDeleteEstabImagesServiceStub = () => {
  class CreateOrDeleteEstablishmentImagesServiceStub implements Service {
    public async exec(dto: any): Promise<any> {
      return {
        inserted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        deleted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      };
    }
  }

  return new CreateOrDeleteEstablishmentImagesServiceStub();
};

interface SutTypes {
  sut: CreateOrDeleteEstablishmentImagesController
  jwtHandlerStub: JwtHandler
  createOrDeleteEstablishmentImagesServiceStub: Service
}

const makeSut = (): SutTypes => {
  const jwtHandlerStub = makeJwtHandlerStub();

  const createOrDeleteEstablishmentImagesServiceStub = makeCreateOrDeleteEstabImagesServiceStub();

  const sut = new CreateOrDeleteEstablishmentImagesController(
    createOrDeleteEstablishmentImagesServiceStub,
    jwtHandlerStub,
  );

  return {
    sut,
    jwtHandlerStub,
    createOrDeleteEstablishmentImagesServiceStub,
  };
};

let sutFactory: SutTypes;

describe('CreateOrDeleteEstablishmentImagesController', () => {
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
        toDelete: ['valid_id'],
        toInsert: ['valid_url'],
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(request);
  });

  test('Should throw exception if authToken is not provided', async () => {
    const { sut } = sutFactory;

    const request: HttpRequest = {
      headers: {
        authorization: '',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        toDelete: ['valid_id'],
        toInsert: ['valid_url'],
      },
    };

    const expectedException = new MissingParamException('authToken');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if toDelete and toInsert are not provided', async () => {
    const { sut } = sutFactory;

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        toDelete: null,
        toInsert: null,
      },
    };

    const expectedException = new MissingParamException('toDelete or toInsert');

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
        toDelete: ['valid_id'],
        toInsert: ['valid_url'],
      },
    };

    await sut.handle(request);

    expect(spyHandler).toHaveBeenCalledOnce();
    expect(spyHandler).toHaveBeenCalledWith(request.headers.authorization);
  });

  test('Should call Service exec method with correct provided params', async () => {
    const { sut, createOrDeleteEstablishmentImagesServiceStub } = sutFactory;

    const spyService = vi.spyOn(createOrDeleteEstablishmentImagesServiceStub, 'exec');

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        toDelete: ['valid_id'],
        toInsert: ['valid_url'],
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledOnce();
    expect(spyService).toHaveBeenCalledWith({
      userId: 'valid_subject_from_token',
      establishmentId: request.params.establishmentId,
      toInsert: request.body.toInsert,
      toDelete: request.body.toDelete,
    });
  });

  test('Should return 201 and updates itens if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const request: HttpRequest = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentId: 'valid_establishmentId',
      },
      body: {
        toDelete: ['valid_id'],
        toInsert: ['valid_url'],
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 201,
      data: {
        inserted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }],
        deleted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }],
      },
    });
  });
});
