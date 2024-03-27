import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UpdateEstablishmentService } from '..';
import { EstablishmentAttatchmentRepository, EstablishmentRepository } from '../../../../data/repositories';
import {
  RegisterEstablishmentEntity,
  EstablishmentEntity,
  EstablishmentAttatchmentEntity,
  CommodityEntity,
  EstablishmentImageEntity,
  BookedDateEntity,
} from '../../../entities';
import { UpdateEstablishmentEntity } from '../../../entities/establishment/update-establishment-entity';
import { EstablishmentTypes } from '../../../entities/enums';
import {
  AlreadyExistsException, ForbiddenException, InvalidParamException, NotFoundException,
} from '../../../../presentation/exceptions';

const makeEstablishmentAttatchmentRepositoryStub = () => {
  const mockAttatchment = {
    id: 'any_id',
    establishmentId: 'any_establishment_id',
    createdAt: new Date(),
    updatedAt: new Date(),
    maxBookingHour: 'any_maxbookingHour',
    minBookingHour: 'any_minbookingHour',
    establishment: {} as EstablishmentEntity,
    commodities: [] as CommodityEntity[],
    images: [] as EstablishmentImageEntity[],
    bookedDates: [] as BookedDateEntity[],

  };
  class EstablishmentAttatchmentRepositoryStub implements EstablishmentAttatchmentRepository {
    async findByEstablishmentId(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      return mockAttatchment;
    }

    async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      return mockAttatchment;
    }
  }

  return new EstablishmentAttatchmentRepositoryStub();
};

const makeEstablishmentRepositoryStub = () => {
  const mockEstablishment: EstablishmentEntity = {
    id: 'any_establishment_id',
    type: EstablishmentTypes.APARTMENT,
    name: 'any_name',
    description: 'any_description',
    ownerId: 'any_ownerId',
    street: 'any_street',
    neighbourhood: 'any_neighbourhood',
    contact: 'any_contact',
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
    save(dto: {
      userId: string;
      establishment: RegisterEstablishmentEntity;
    }): Promise<EstablishmentEntity> {
      throw new Error('Method not implemented.');
    }

    async findByName(dto: { userId: string; name: string; }): Promise<EstablishmentEntity | null> {
      return null;
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
      return mockEstablishment;
    }

    findAllByUserId(params: {
      userId: string;
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
      return mockEstablishment;
    }
  }

  return new EstablishmentRepositoryStub();
};

interface SutTypes {
  sut: UpdateEstablishmentService
  establishmentAttatchmentRepositoryStub: EstablishmentAttatchmentRepository
  establishmentRepositoryStub: EstablishmentRepository
}

const makeSut = (): SutTypes => {
  const establishmentAttatchmentRepositoryStub = makeEstablishmentAttatchmentRepositoryStub();
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();

  const sut = new UpdateEstablishmentService(
    establishmentRepositoryStub,
    establishmentAttatchmentRepositoryStub,
  );

  vi.spyOn(sut, 'contactCheck').mockReturnValue(true);
  vi.spyOn(sut, 'countryAbbreviationCheck').mockReturnValue(true);
  vi.spyOn(sut, 'hourAndMinuteFormatCheck').mockReturnValue(true);
  vi.spyOn(sut, 'postalCodeCheck').mockReturnValue(true);

  return {
    sut,
    establishmentAttatchmentRepositoryStub,
    establishmentRepositoryStub,
  };
};

let sutFactory: SutTypes;

describe('UpdateEstablishmentService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
      },
    };

    await sut.exec(args);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(args);
  });

  test('Should throw exception if provided zipcode is invalid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'postalCodeCheck').mockReturnValueOnce(false);

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        zipcode: 'invalid_zipcode',
      },
    };

    const expectedException = new InvalidParamException('zipcode');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if provided contact is invalid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'contactCheck').mockReturnValueOnce(false);

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'invalid_contact',
        street: 'valid_street',
      },
    };

    const expectedException = new InvalidParamException('contact');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if provided country is invalid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'countryAbbreviationCheck').mockReturnValueOnce(false);

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'invalid_country',
      },
    };

    const expectedException = new InvalidParamException('country');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentAttatchmentRepository findByEstablishmentId with correct provided params', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentAttatchmentRepositoryStub, 'findByEstablishmentId');

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(args.update.id);
  });

  test('Should throw exception if EstablishmentAttatchment doest not exists', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentAttatchmentRepositoryStub, 'findByEstablishmentId').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    const expectedException = new NotFoundException('Establishment Attatchment');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if minBookingHour or minBookingHour is invalid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'hourAndMinuteFormatCheck').mockReset();

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
        maxBookingHour: '22',
        minBookingHour: '12:00',
      },
    };

    const expectedException = new InvalidParamException('maxBookingHour');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if minBookingHour is later than maxBookingHour', async () => {
    const { sut } = sutFactory;

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
        maxBookingHour: '22:00',
        minBookingHour: '23:00',
      },
    };

    const expectedException = new InvalidParamException("maxBookingHour can't be less than minBookingHour");

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findByName with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentRepositoryStub, 'findByName');

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      name: args.update.name,
      userId: args.ownerId,
    });
  });

  test('Should throw Exception if provided name already exists on account', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findByName').mockReturnValueOnce(
      Promise.resolve({} as EstablishmentEntity),
    );

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    const expectedException = new AlreadyExistsException('An Establishment with this name');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findById with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentRepositoryStub, 'findById');

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(args.update.id);
  });

  test('Should call throw exception if Establishment is not found', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    const expectedException = new NotFoundException('Establishment');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call throw exception if Establishment does not belong to provided ownerId', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_establishment_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        ownerId: 'different_owner_id',
        street: 'any_street',
        contact: 'any_contact',
        neighbourhood: 'any_neighbourhood',
        zipcode: 'any_zipcode',
        number: 'any_number',
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        complement: 'any_complement',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    const expectedException = new ForbiddenException('Requester does not owns this establishment');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository update with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentRepositoryStub, 'update');

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      ownerId: args.ownerId,
      args: args.update,
    });
  });

  test('Should return the updated EstablishmentEntity if nothing goes wrong', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'update').mockReturnValueOnce(
      Promise.resolve(
        {
          id: 'any_establishment_id',
          type: EstablishmentTypes.APARTMENT,
          name: 'any_name',
          description: 'any_description',
          ownerId: 'different_owner_id',
          street: 'updated_street',
          contact: 'updated_contact',
          neighbourhood: 'any_neighbourhood',
          zipcode: 'any_zipcode',
          number: 'any_number',
          city: 'any_city',
          state: 'any_state',
          country: 'updated_country',
          complement: 'any_complement',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ),
    );

    const args = {
      ownerId: 'any_ownerId',
      update: {
        id: 'valid_id',
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        country: 'valid_country',
      },
    };

    const serviceResponse = await sut.exec(args);

    expect(serviceResponse).toEqual({
      id: 'any_establishment_id',
      type: EstablishmentTypes.APARTMENT,
      name: 'any_name',
      description: 'any_description',
      ownerId: 'different_owner_id',
      street: 'updated_street',
      contact: 'updated_contact',
      neighbourhood: 'any_neighbourhood',
      zipcode: 'any_zipcode',
      number: 'any_number',
      city: 'any_city',
      state: 'any_state',
      country: 'updated_country',
      complement: 'any_complement',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
});
