import {
  describe,
  test,
  vi,
  expect,
  beforeEach,
} from 'vitest';
import { ListBookedDatesController } from './list-booked-dates-controller';
import { JwtHandler } from '../../protocols';
import { Service } from '../../../domain/protocols';
import { BookedDateEntity } from '../../../domain/entities';
import { MissingParamException } from '../../exceptions';

const makeListBookedDatesServiceStub = () => {
  class ListBookedDatedServiceStub implements Service {
    async exec(dto: any): Promise<{
      page: number,
      perPage: number,
      list: BookedDateEntity[]
    }> {
      return {
        page: 1,
        perPage: 5,
        list: [
          {
            id: 'any_id',
            establishmentAttatchmentId: 'valid_establishment_attatchment_id',
            userId: 'valid_user_id',
            bookedDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      };
    }
  }

  return new ListBookedDatedServiceStub();
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

interface SutType {
  sut: ListBookedDatesController
  listBookedDatesServiceStub: Service
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutType => {
  const listBookedDatesServiceStub = makeListBookedDatesServiceStub();
  const jwtHandlerStub = makeJwtHandlerStub();
  const sut = new ListBookedDatesController(jwtHandlerStub, listBookedDatesServiceStub);

  return {
    sut,
    listBookedDatesServiceStub,
    jwtHandlerStub,
  };
};

let sutFactory: SutType;

describe('ListBookedDatesController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ListBookedDatesController handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
        perPage: '2',
      },
    };

    await sut.handle(requestArgs);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(requestArgs);
  });

  test('Should call JwtHandler decode method with correct provided params', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyHandler = vi.spyOn(jwtHandlerStub, 'decode');

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
        perPage: '2',
      },
    };

    await sut.handle(requestArgs);

    expect(spyHandler).toHaveBeenCalledOnce();
    expect(spyHandler).toHaveBeenCalledWith(requestArgs.headers.authorization);
  });

  test('Should call ListBookedDatesController dtoCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'dtoCheck');

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
        perPage: '2',
      },
    };

    await sut.handle(requestArgs);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith({
      page: requestArgs.query.page,
      perPage: requestArgs.query.perPage,
      parseId: 'valid_id',
    });
  });

  test('Should throw Exception if page param is not provided', async () => {
    const { sut } = sutFactory;

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        perPage: '2',
      },
    };

    const expectedException = new MissingParamException('page');

    await expect(() => sut.handle(requestArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if perPage param is not provided', async () => {
    const { sut } = sutFactory;

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
      },
    };

    const expectedException = new MissingParamException('perPage');

    await expect(() => sut.handle(requestArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if parseId param is not provided', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    vi.spyOn(jwtHandlerStub, 'decode').mockReturnValueOnce('');

    const requestArgs = {
      headers: {
        authorization: '',
      },
      query: {
        page: '1',
        perPage: '5',
      },
    };

    const expectedException = new MissingParamException('parseId');

    await expect(() => sut.handle(requestArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should call Service exec method with correct provided params', async () => {
    const { sut, listBookedDatesServiceStub } = sutFactory;

    const spyService = vi.spyOn(listBookedDatesServiceStub, 'exec');

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
        perPage: '2',
      },
    };

    await sut.handle(requestArgs);

    expect(spyService).toHaveBeenCalledOnce();
    expect(spyService).toHaveBeenCalledWith({
      page: requestArgs.query.page,
      perPage: requestArgs.query.perPage,
      userId: 'valid_id',
    });
  });

  test('Should return 200 and data if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestArgs = {
      headers: {
        authorization: 'valid_token',
      },
      query: {
        page: '1',
        perPage: '2',
      },
    };

    const response = await sut.handle(requestArgs);

    expect(response).toEqual({
      status: 200,
      data: {
        page: 1,
        perPage: 5,
        list: [
          {
            id: 'any_id',
            establishmentAttatchmentId: 'valid_establishment_attatchment_id',
            userId: 'valid_user_id',
            bookedDate: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      },
    });
  });
});
