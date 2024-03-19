import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { ListEstablishmentController } from './list-establishments-controller';
import { EstablishmentRepository } from '../../../data/repositories';
import { RegisterEstablishmentEntity, EstablishmentEntity } from '../../../domain/entities';
import { EstablishmentTypes } from '../../../domain/entities/enums';
import { MissingParamException } from '../../exceptions';

const makeEstablishmentRepositoryStub = () => {
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

  class EstablishmentRepositoryStub implements EstablishmentRepository {
    async save(dto: {
      userId: string,
      establishment: RegisterEstablishmentEntity,
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }

    async findByName(dto: {
      userId: string,
      name: string;
    }): Promise<EstablishmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    async find(query: {
      page: string,
      perPage: string,
      name?: string | undefined,
      state?: string | undefined,
      city?: string | undefined;
    }):Promise<{
        page: number,
        perPage: number,
        list: EstablishmentEntity[]
      }> {
      return {
        page: 1,
        perPage: 5,
        list: [mockEstablishment],
      };
    }
  }

  return new EstablishmentRepositoryStub();
};

interface SutTypes {
  sut: ListEstablishmentController,
  establishmentRepositoryStub: EstablishmentRepository
}

const makeSut = (): SutTypes => {
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const sut = new ListEstablishmentController(establishmentRepositoryStub);

  return {
    sut,
    establishmentRepositoryStub,
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

  test('Should call EstablishmentRepository find method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'find');

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
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      },
    });
  });
});
