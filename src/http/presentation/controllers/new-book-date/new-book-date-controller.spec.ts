import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { NewBookDateController } from './new-book-date-controller';
import { JwtHandler } from '../../protocols';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';

const makeNewBookDateService = () => {
  class NewBookDateService implements Service {
    async exec(dto: any): Promise<any> {
      return {
        id: 'new_book_id',
        bookedDate: 'new_book_date',
      };
    }
  }

  return new NewBookDateService();
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
  sut: NewBookDateController,
  newBookDateService: Service,
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutTypes => {
  const newBookDateService = makeNewBookDateService();
  const jwtHandlerStub = makeJwtHandlerStub();
  const sut = new NewBookDateController(jwtHandlerStub, newBookDateService);

  return {
    sut,
    newBookDateService,
    jwtHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('NewBookDateController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call NewBookDateController handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    const spySut = vi.spyOn(sut, 'handle');

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(request);
  });

  test('Should call JwtHandler decode method with correct provided params', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    const spyJwtHandler = vi.spyOn(jwtHandlerStub, 'decode');

    await sut.handle(request);

    expect(spyJwtHandler).toHaveBeenCalledOnce();
    expect(spyJwtHandler).toHaveBeenCalledWith(request.headers.authorization);
  });

  test('Should call NewBookDateController dtoCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    const spySut = vi.spyOn(sut, 'dtoCheck');

    await sut.handle(request);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith({
      userId: 'valid_id',
      establishmentAttatchmentId: request.params.establishmentAttatchmentId,
    });
  });

  test('Should throw Exception if userId is not provided', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const request = {
      headers: {
        authorization: null,
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    vi.spyOn(jwtHandlerStub, 'decode').mockReturnValueOnce('');

    const expectedException = new MissingParamException('userId');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if establishmentAttatchmentId is not provided', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: null,
      },
    };

    const expectedException = new MissingParamException('establishmentAttatchmentId');

    await expect(() => sut.handle(request)).rejects.toStrictEqual(expectedException);
  });

  test('Should call NewBookDateService exec method with correct provided params', async () => {
    const { sut, newBookDateService } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    const spyNewBookDateService = vi.spyOn(newBookDateService, 'exec');

    await sut.handle(request);

    expect(spyNewBookDateService).toHaveBeenCalledOnce();
    expect(spyNewBookDateService).toHaveBeenCalledWith({
      userId: 'valid_id',
      establishmentAttatchmentId: request.params.establishmentAttatchmentId,
    });
  });

  test('Should return newBooking id and bookedDate if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const request = {
      headers: {
        authorization: 'valid_token',
      },
      params: {
        establishmentAttatchmentId: 'valid_attatchment_id',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual({
      status: 201,
      data: {
        id: 'new_book_id',
        bookedDate: 'new_book_date',
      },
    });
  });
});
