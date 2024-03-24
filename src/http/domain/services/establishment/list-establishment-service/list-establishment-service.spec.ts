import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { ListEstablishmentService } from '..';
import { EstablishmentRepository } from '../../../../data/repositories';
import { RegisterEstablishmentEntity, EstablishmentEntity } from '../../../entities';
import { EstablishmentTypes } from '../../../entities/enums';

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
    findAllByUserId(params: { userId: string;
      page: number;
      perPage: number;
      orderBy: 'asc' | 'desc';
      name?: string | undefined;
    }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
      throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<EstablishmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    async save(dto: {
      userId: string,
      establishment: RegisterEstablishmentEntity,
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }

    async findByName(dto: {
      userId: string,
      name: string,
    }): Promise<EstablishmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    async find(query: {
      page: number,
      perPage: number,
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
  sut: ListEstablishmentService,
  establishmentRepositoryStub: EstablishmentRepository
}

const makeSut = () => {
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const sut = new ListEstablishmentService(establishmentRepositoryStub);

  return {
    sut,
    establishmentRepositoryStub,
  };
};

let sutFactory: SutTypes;

describe('ListEstablishmentService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ListEstablishmentService exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const queryParams = {
      page: 1,
      perPage: 5,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    await sut.exec(queryParams);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(queryParams);
  });

  test('Should call EstablishmentRepository find method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'find');

    const queryParams = {
      page: 1,
      perPage: 5,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    await sut.exec(queryParams);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith(queryParams);
  });

  test('Should transform page in 1 if provided page is less than 1', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'find');

    const queryParams = {
      page: 0,
      perPage: 5,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    await sut.exec(queryParams);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith({
      ...queryParams,
      page: 1,
    });
  });

  test('Should transform perPage in 100 if provided page is more than 100', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'find');

    const queryParams = {
      page: 1,
      perPage: 200,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    await sut.exec(queryParams);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith({
      ...queryParams,
      perPage: 100,
    });
  });

  test('Should transform perPage in 5 if provided page is less than 5', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'find');

    const queryParams = {
      page: 1,
      perPage: 3,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    await sut.exec(queryParams);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith({
      ...queryParams,
      perPage: 5,
    });
  });

  test('Should return Establishment list if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const queryParams = {
      page: 1,
      perPage: 5,
      city: 'valid_city',
      name: 'valid_name',
      state: 'SP',
    };

    const response = await sut.exec(queryParams);

    expect(response).toEqual({
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
    });
  });
});
