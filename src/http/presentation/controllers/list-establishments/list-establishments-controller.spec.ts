import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { ListEstablishmentController } from './list-establishments-controller';
import { EstablishmentEntity } from '../../../domain/entities';
import { EstablishmentTypes } from '../../../domain/entities/enums';
import { MissingParamException } from '../../exceptions';
import { Service } from '../../../domain/protocols';

const makeListEstablishmentServiceStub = () => {
  const mockEstablishment: EstablishmentEntity = {
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
  };

  class ListEstablishmentServiceStub implements Service {
    async exec(dto: any): Promise<any> {
      return {
        page: 1,
        perPage: 5,
        list: [mockEstablishment],
      };
    }
  }

  return new ListEstablishmentServiceStub();
};

interface SutTypes {
  sut: ListEstablishmentController,
  listEstablishmentServiceStub: Service
}

const makeSut = (): SutTypes => {
  const listEstablishmentServiceStub = makeListEstablishmentServiceStub();
  const sut = new ListEstablishmentController(listEstablishmentServiceStub);

  return {
    sut,
    listEstablishmentServiceStub,
  };
};

let sutFactory: SutTypes;

describe('ListEstablishmentController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ListEstablishmentController handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestQuery = {
      query: {
        page: 1,
        perPage: 5,
        name: 'valid_name',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    await sut.handle(requestQuery);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(requestQuery);
  });

  test('Should throw Exception if page is not provided', async () => {
    const { sut } = sutFactory;

    const requestQuery = {
      query: {
        perPage: 5,
        name: 'valid_name',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    const expectedException = new MissingParamException('page');

    await expect(() => sut.handle(requestQuery)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if perPage is not provided', async () => {
    const { sut } = sutFactory;

    const requestQuery = {
      query: {
        page: 1,
        name: 'valid_name',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    const expectedException = new MissingParamException('perPage');

    await expect(() => sut.handle(requestQuery)).rejects.toStrictEqual(expectedException);
  });

  test('Should call ListEstablishmentService find method with correct provided params', async () => {
    const { sut, listEstablishmentServiceStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(listEstablishmentServiceStub, 'exec');

    const requestQuery = {
      query: {
        page: 1,
        perPage: 5,
        name: 'valid_name',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    await sut.handle(requestQuery);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith({
      ...requestQuery.query,
    });
  });

  test('Should return Establishment list if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestQuery = {
      query: {
        page: 1,
        perPage: 5,
        name: 'valid_name',
        state: 'valid_state',
        city: 'valid_city',
      },
    };

    const response = await sut.handle(requestQuery);

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
