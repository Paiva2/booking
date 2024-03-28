import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { EstablishmentAttatchmentRepository, EstablishmentRepository } from '../../../../data/repositories';
import {
  EstablishmentAttatchmentEntity,
  EstablishmentEntity,
  EstablishmentImageEntity,
  RegisterEstablishmentEntity,
} from '../../../entities';
import { UpdateEstablishmentEntity } from '../../../entities/establishment/update-establishment-entity';
import { EstablishmentImagesRepository } from '../../../../data/repositories/establishment-images-repository';
import { EstablishmentTypes } from '../../../entities/enums';
import { ForbiddenException, MissingParamException, NotFoundException } from '../../../../presentation/exceptions';
import { CreateOrDeleteEstablishmentImagesService } from '..';

const makeEstablishmentImagesRepositoryStub = () => {
  class EstablishmentImagesRepositoryStub implements EstablishmentImagesRepository {
    async createOrDelete(args:{
      toInsert: string[] | null;
      toDelete: string[] | null;
    }): Promise<{
        inserted: EstablishmentImageEntity[] | null;
        deleted: EstablishmentImageEntity[] | null;
      }> {
      return {
        deleted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        inserted: [{
          id: 'any_id',
          url: 'any_url',
          establishmentAttatchmentId: 'any_establishmentAttatchmentId',
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      };
    }
  }

  return new EstablishmentImagesRepositoryStub();
};

const makeEstablishmentRepositoryStub = () => {
  class EstablishmentRepositoryStub implements EstablishmentRepository {
    async save(dto: { userId: string;
      establishment: RegisterEstablishmentEntity;
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }

    async findByName(dto: { userId: string;
      name: string;
    }): Promise<EstablishmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    async find(query: { page: number;
      perPage: number;
      name?: string | undefined;
      state?: string | undefined;
      city?: string | undefined;
    }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
      throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<EstablishmentEntity | null> {
      return {
        id: 'valid_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        ownerId: 'any_ownerId',
        contact: 'any_contact',
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

    async findAllByUserId(params: { userId: string;
      page: number;
      perPage: number;
      orderBy: 'asc' | 'desc';
      name?: string | undefined;
    }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
      throw new Error('Method not implemented.');
    }

    async update(dto: {
      ownerId: string;
      args: UpdateEstablishmentEntity;
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }
  }

  return new EstablishmentRepositoryStub();
};

const makeEstablishmentAttatchmentRepositoryStub = () => {
  class EstablishmentAttatchmentRepositoryStub implements EstablishmentAttatchmentRepository {
    async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      throw new Error('Method not implemented.');
    }

    async findByEstablishmentId(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      return {
        id: 'any_id',
        maxBookingHour: 'any_maxBookingHour',
        minBookingHour: 'any_minBookingHour',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return new EstablishmentAttatchmentRepositoryStub();
};

interface SutTypes {
  sut: CreateOrDeleteEstablishmentImagesService
  establishmentImagesRepositoryStub: EstablishmentImagesRepository
  establishmentRepositoryStub: EstablishmentRepository
  establishmentAttatchmentRepositoryStub: EstablishmentAttatchmentRepository
}

const makeSut = (): SutTypes => {
  const establishmentImagesRepositoryStub = makeEstablishmentImagesRepositoryStub();
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const establishmentAttatchmentRepositoryStub = makeEstablishmentAttatchmentRepositoryStub();

  const sut = new CreateOrDeleteEstablishmentImagesService(
    establishmentAttatchmentRepositoryStub,
    establishmentRepositoryStub,
    establishmentImagesRepositoryStub,
  );

  return {
    sut,
    establishmentImagesRepositoryStub,
    establishmentRepositoryStub,
    establishmentAttatchmentRepositoryStub,
  };
};

let sutFactory: SutTypes;

describe('CreateOrDeleteEstablishmentImagesService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],

    };

    await sut.exec(serviceArgs);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(serviceArgs);
  });

  test('Should throw exception if toDelete AND toInsert are empty', async () => {
    const { sut } = sutFactory;

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: [],
      toInsert: [],
    };

    const expectedException = new MissingParamException('toDelete or toInsert');

    await expect(() => sut.exec(serviceArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findById method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentRepositoryStub, 'findById');

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],

    };

    await sut.exec(serviceArgs);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(serviceArgs.establishmentId);
  });

  test('Should throw exception if Establishment is not found', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],
    };

    const expectedException = new NotFoundException('Establishment');

    await expect(() => sut.exec(serviceArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if Establishment does not belong to provided userId', async () => {
    const { sut } = sutFactory;

    const serviceArgs = {
      userId: 'other_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],
    };

    const expectedException = new ForbiddenException('Provided userId dont owns this establishment');

    await expect(() => sut.exec(serviceArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentAttatchmentRepository findByEstablishmentId method with correct provided params', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentAttatchmentRepositoryStub, 'findByEstablishmentId');

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],

    };

    await sut.exec(serviceArgs);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith('valid_id');
  });

  test('Should throw exception if EstablishmentAttatchment is not found', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentAttatchmentRepositoryStub, 'findByEstablishmentId').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],
    };

    const expectedException = new NotFoundException('Establishment attatchment');

    await expect(() => sut.exec(serviceArgs)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentImagesRepository createOrDelete method with correct provided params', async () => {
    const { sut, establishmentImagesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentImagesRepositoryStub, 'createOrDelete');

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],

    };

    await sut.exec(serviceArgs);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      toDelete: serviceArgs.toDelete,
      toInsert: serviceArgs.toInsert,
    });
  });

  test('Should return an object with images inserted and images deleted', async () => {
    const { sut } = sutFactory;

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_id'],
      toInsert: ['valid_url'],

    };

    const serviceReponse = await sut.exec(serviceArgs);

    expect(serviceReponse).toEqual({
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
    });
  });

  test('Should return an object with images inserted and null for images deleted', async () => {
    const { sut, establishmentImagesRepositoryStub } = sutFactory;

    vi.spyOn(establishmentImagesRepositoryStub, 'createOrDelete').mockReturnValueOnce(
      Promise.resolve(
        {
          deleted: null,
          inserted: [{
            id: 'any_id',
            url: 'any_url',
            establishmentAttatchmentId: 'any_establishmentAttatchmentId',
            createdAt: new Date(),
            updatedAt: new Date(),
          }],
        },
      ),
    );

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: [],
      toInsert: ['valid_url'],

    };

    const serviceReponse = await sut.exec(serviceArgs);

    expect(serviceReponse).toEqual({
      inserted: [{
        id: 'any_id',
        url: 'any_url',
        establishmentAttatchmentId: 'any_establishmentAttatchmentId',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }],
      deleted: null,
    });
  });

  test('Should return an object with images deleted and null for images inserted', async () => {
    const { sut, establishmentImagesRepositoryStub } = sutFactory;

    vi.spyOn(establishmentImagesRepositoryStub, 'createOrDelete').mockReturnValueOnce(
      Promise.resolve(
        {
          deleted: [{
            id: 'any_id',
            url: 'any_url',
            establishmentAttatchmentId: 'any_establishmentAttatchmentId',
            createdAt: new Date(),
            updatedAt: new Date(),
          }],
          inserted: null,
        },
      ),
    );

    const serviceArgs = {
      userId: 'any_ownerId',
      establishmentId: 'valid_establishmentId',
      toDelete: ['valid_url'],
      toInsert: [],

    };

    const serviceReponse = await sut.exec(serviceArgs);

    expect(serviceReponse).toEqual({
      inserted: null,
      deleted: [{
        id: 'any_id',
        url: 'any_url',
        establishmentAttatchmentId: 'any_establishmentAttatchmentId',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }],
    });
  });
});
