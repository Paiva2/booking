import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { FilterEstablishmentService } from '..';
import { EstablishmentRepository } from '../../../../data/repositories';
import { RegisterEstablishmentEntity, EstablishmentEntity } from '../../../entities';
import { EstablishmentTypes } from '../../../entities/enums';
import { NotFoundException } from '../../../../presentation/exceptions';

const makeEstablishmentRepositoryStub = () => {
  class EstablishmentRepositoryStub implements EstablishmentRepository {
    save(dto: {
      userId: string;
      establishment: RegisterEstablishmentEntity;
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }

    findByName(dto: { userId: string; name: string; }): Promise<EstablishmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    find(query: {
      page: number;
      perPage: number;
      name?: string | undefined;
      state?: string | undefined;
      city?: string | undefined;
    }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
      throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<EstablishmentEntity | null> {
      return {
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
    }
  }

  return new EstablishmentRepositoryStub();
};

interface SutType {
  sut: FilterEstablishmentService
  establishmentRepositoryStub: EstablishmentRepository
}

const makeSut = (): SutType => {
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const sut = new FilterEstablishmentService(establishmentRepositoryStub);

  return {
    sut,
    establishmentRepositoryStub,
  };
};

let sutFactory: SutType;

describe('FilterEstablishmentService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const args = {
      establishmentId: 'valid_establishment_id',
    };

    await sut.exec(args);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(args);
  });

  test('Should call EstablishmentRepository findById method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentRepositoryStub, 'findById');

    const args = {
      establishmentId: 'valid_establishment_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(args.establishmentId);
  });

  test('Should throw an exception if Establishment does not exists', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const args = {
      establishmentId: 'valid_establishment_id',
    };

    const expectedException = new NotFoundException('Establishment');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should return the filtered Establishment if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const args = {
      establishmentId: 'valid_establishment_id',
    };

    const sutResponse = await sut.exec(args);

    expect(sutResponse).toEqual({
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
    });
  });
});
