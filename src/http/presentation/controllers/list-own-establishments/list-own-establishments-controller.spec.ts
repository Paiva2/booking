import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { JwtHandler } from '../../protocols';
import { ListOwnEstablishmentsController } from './list-own-establishments-controller';
import { Service } from '../../../domain/protocols';
import { EstablishmentTypes } from '../../../domain/entities/enums';
import { MissingParamException } from '../../exceptions';

const makeListOwnEstablishmentsServiceStub = () => {
  class ListOwnEstablishmentsServiceStub implements Service {
    async exec(dto: any): Promise<any> {
      return {
        page: 1,
        perPage: 5,
        list: [{
          id: 'any_id',
          type: EstablishmentTypes.APARTMENT,
          name: 'any_name',
          description: 'any_description',
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
        }],
      };
    }
  }

  return new ListOwnEstablishmentsServiceStub();
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
  sut: ListOwnEstablishmentsController
  listOwnEstablishmentsService: Service
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutTypes => {
  const listOwnEstablishmentsService = makeListOwnEstablishmentsServiceStub();
  const jwtHandlerStub = makeJwtHandlerStub();

  const sut = new ListOwnEstablishmentsController(
    listOwnEstablishmentsService,
    jwtHandlerStub,
  );

  return {
    sut,
    listOwnEstablishmentsService,
    jwtHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('ListOwnEstablishmentsController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(request);
  });

  test('Should call SUT dtoCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'dtoCheck');

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith({ userId: request.headers.authorization });
  });

  test('Should throw exception if userId is not provided', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: '',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    const expectedException = new MissingParamException('userId');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should call JwtHandler decode method with correct provided params', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyHandler = vi.spyOn(jwtHandlerStub, 'decode');

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    await sut.handle(request);

    expect(spyHandler).toHaveBeenCalledOnce();
    expect(spyHandler).toHaveBeenCalledWith(request.headers.authorization);
  });

  test('Should call Service exec method with correct provided params', async () => {
    const { sut, listOwnEstablishmentsService } = sutFactory;

    const spyService = vi.spyOn(listOwnEstablishmentsService, 'exec');

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    await sut.handle(request);

    expect(spyService).toHaveBeenCalledOnce();
    expect(spyService).toHaveBeenCalledWith({
      userId: 'valid_id',
      name: 'valid_name',
      page: '1',
      perPage: '5',
      orderBy: 'valid_order_by',
    });
  });

  test('Should return 200 and filtered items if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        name: 'valid_name',
        page: '1',
        perPage: '5',
        orderBy: 'valid_order_by',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 200,
      data: {
        page: 1,
        perPage: 5,
        list: [{
          id: 'any_id',
          type: EstablishmentTypes.APARTMENT,
          name: 'any_name',
          description: 'any_description',
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
        }],
      },
    });
  });
});
