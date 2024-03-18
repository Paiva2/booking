import {
  describe,
  test,
  beforeEach,
  vi,
  expect,
} from 'vitest';
import {
  UserEntity,
  CreateUserEntity,
  UpdateUserEntity,
  EstablishmentEntity,
  RegisterEstablishmentEntity,
} from '../../../entities';
import { RegisterEstablishmentService } from '..';
import { EstablishmentTypes } from '../../../entities/enums';
import { EstablishmentRepository, UserRepository } from '../../../../data/repositories';
import { AlreadyExistsException, InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';

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
      establishment: RegisterEstablishmentEntity; }): Promise<EstablishmentEntity> {
      return mockEstablishment;
    }

    async findByName(dto: { userId: string; name: string; }): Promise<EstablishmentEntity | null> {
      return null;
    }
  }

  return new EstablishmentRepositoryStub();
};

const makeUserRepositoryStub = () => {
  const mockUser = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    contact: 'valid_contact',
    password: 'valid_hashed_password',
    neighbourhood: 'valid_neighbourhood',
    street: 'valid_street',
    city: 'valid_city',
    state: 'valid_state',
    number: 'valid_number',
    complement: 'valid_complement',
    zipcode: 'valid_zipcode',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class UserRepositoryStub implements UserRepository {
    async findByEmail(email: string): Promise<UserEntity | null> {
      return mockUser;
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return mockUser;
    }

    async findById(id: string): Promise<UserEntity | null> {
      return mockUser;
    }

    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      return mockUser;
    }
  }

  return new UserRepositoryStub();
};

interface SutType {
  sut: RegisterEstablishmentService
  userRepositoryStub: UserRepository
  establishmentRepositoryStub: EstablishmentRepository
}

const makeSut = (): SutType => {
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const sut = new RegisterEstablishmentService(userRepositoryStub, establishmentRepositoryStub);

  vi.spyOn(sut, 'contactCheck').mockReturnValue(true);
  vi.spyOn(sut, 'countryAbbreviationCheck').mockReturnValue(true);
  vi.spyOn(sut, 'postalCodeCheck').mockReturnValue(true);

  return {
    sut,
    userRepositoryStub,
    establishmentRepositoryStub,
  };
};

let sutFactory: SutType;

describe('RegisterEstablishmentService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call RegisterEstablishmentService exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'valid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    await sut.exec({ ...paramsBody });

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(paramsBody);
  });

  test('Should throw an Exception if zipcode is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'postalCodeCheck').mockReturnValueOnce(false);

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'invalid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'valid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('zipcode');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if contact is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'contactCheck').mockReturnValueOnce(false);

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'invalid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'valid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('contact');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if country is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'countryAbbreviationCheck').mockReturnValueOnce(false);

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('country');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if country is not valid', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'countryAbbreviationCheck').mockReturnValueOnce(false);

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: 'valid_maxBookingHour',
        minBookingHour: 'validminBookingHour',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('country');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if maxBookingHour is not valid', async () => {
    const { sut } = sutFactory;
    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: 'invalid_max_booking_hour',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('maxBookingHour');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if minBookingHour is not valid', async () => {
    const { sut } = sutFactory;
    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: 'invalid_min_booking_hour',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException('minBookingHour');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw an Exception if minBookingHour is later than maxBookingHour', async () => {
    const { sut } = sutFactory;
    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '12:21',
        minBookingHour: '12:22',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new InvalidParamException("maxBookingHour can't be less than minBookingHour");

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call UserRepository findById method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findById');

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    await sut.exec(paramsBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledOnce();
    expect(spyUserRepositoryStub).toHaveBeenCalledWith(paramsBody.userId);
  });

  test('Should throw Exceptin if user doesnt exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null));

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findByName method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'findByName');

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    await sut.exec(paramsBody);

    expect(spyUserRepositoryStub).toHaveBeenCalledOnce();
    expect(spyUserRepositoryStub).toHaveBeenCalledWith({
      userId: paramsBody.userId,
      name: paramsBody.establishment.name,
    });
  });

  test('Should throw Exception if user already has an establishment with this name', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentRepositoryStub, 'findByName').mockReturnValueOnce(Promise.resolve({
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
    }));

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const expectedException = new AlreadyExistsException('An Establishment with this name');

    await expect(() => sut.exec(paramsBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository save method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const spyEstablishmentRepositoryStub = vi.spyOn(establishmentRepositoryStub, 'save');

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    await sut.exec(paramsBody);

    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledOnce();
    expect(spyEstablishmentRepositoryStub).toHaveBeenCalledWith(paramsBody);
  });

  test('Should return a EstablishmentEntity if nothing goes wrong', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const establishment = {
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

    vi.spyOn(establishmentRepositoryStub, 'save').mockReturnValueOnce(
      Promise.resolve(establishment),
    );

    const paramsBody = {
      userId: 'valid_id',
      establishment: {
        type: EstablishmentTypes.APARTMENT,
        name: 'valid_name',
        description: 'valid_description',
        contact: 'valid_contact',
        street: 'valid_street',
        neighbourhood: 'valid_neighbourhood',
        zipcode: 'valid_zipcode',
        maxBookingHour: '22:00',
        minBookingHour: '10:00',
        number: 'valid_number',
        city: 'valid_city',
        state: 'valid_state',
        country: 'invalid_country',
        complement: 'valid_complement',
        images: ['valid_url_1'],
        commodities: [{
          name: 'Pet free',
          iconUrl: 'any_url',
        }, {
          name: 'Free Wi-fi',
          iconUrl: 'any_url',
        }],
      },
    };

    const response = await sut.exec(paramsBody);

    expect(response).toEqual(establishment);
  });
});
