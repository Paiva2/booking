import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { NewBookDateService } from './new-book-date-service';
import { NewBookedDateEntity } from '../../entities/booked-date/new-booked-date-entity';
import {
  BookedDatesRepository,
  EstablishmentAttatchmentRepository,
  UserRepository,
} from '../../../data/repositories';
import {
  BookedDateEntity,
  CreateUserEntity,
  EstablishmentAttatchmentEntity,
  UpdateUserEntity,
  UserEntity,
} from '../../entities';
import {
  AlreadyBookedException,
  ConflictException, InvalidParamException, NotFoundException, PastDateException,
} from '../../../presentation/exceptions';

const makeEstablishmentAttatchmentRepositoryStub = () => {
  class EstablishmentAttatchmentRepositoryStub implements EstablishmentAttatchmentRepository {
    async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      return {
        id: 'any_id',
        establishmentId: 'any_establishment_id',
        createdAt: new Date(),
        updatedAt: new Date(),
        establishment: {
          id: 'any_establishment_id',
          name: 'any_name',
          ownerId: 'any_onwner_id',
        },
      };
    }
  }

  return new EstablishmentAttatchmentRepositoryStub();
};

const makeUserRepositoryStub = () => {
  const clientUserEntity = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
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
      return {} as UserEntity;
    }

    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      return {} as UserEntity;
    }

    async save(_: CreateUserEntity): Promise<UserEntity> {
      return {} as UserEntity;
    }

    async findById(_: string): Promise<UserEntity | null> {
      return clientUserEntity;
    }
  }

  return new UserRepositoryStub();
};

const makeBookedDatesRepositoryStub = () => {
  class BookedDatesRepositoryStub implements BookedDatesRepository {
    async findBookedDate(params: {
      attatchmentId: string;
      bookedDate: string;
    }): Promise<BookedDateEntity | null> {
      return null;
    }

    async save(create: NewBookedDateEntity): Promise<BookedDateEntity> {
      return {
        id: 'any_id',
        userId: 'any_user_id',
        bookedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        establishmentAttatchmentId: 'any_establishment_attatchment_id',
      };
    }
  }

  return new BookedDatesRepositoryStub();
};

interface SutTypes {
  sut: NewBookDateService
  establishmentAttatchmentRepositoryStub: EstablishmentAttatchmentRepository
  userRepositoryStub: UserRepository
  bookedDatesRepositoryStub: BookedDatesRepository
}

const makeSut = (): SutTypes => {
  const establishmentAttatchmentRepositoryStub = makeEstablishmentAttatchmentRepositoryStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const bookedDatesRepositoryStub = makeBookedDatesRepositoryStub();

  const sut = new NewBookDateService(
    bookedDatesRepositoryStub,
    userRepositoryStub,
    establishmentAttatchmentRepositoryStub,
  );

  vi.spyOn(sut, 'dateCheck').mockReturnValue(true);
  vi.spyOn(sut, 'isDateBeforeToday').mockReturnValue(false);
  vi.spyOn(sut, 'convertDateToView').mockImplementation(() => 'converted_date');

  return {
    sut,
    establishmentAttatchmentRepositoryStub,
    userRepositoryStub,
    bookedDatesRepositoryStub,
  };
};

let sutFactory: SutTypes;

describe('NewBookDateService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(reqBody);
  });

  test('Should call SUT dateCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'dateCheck');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(reqBody.bookedDate);
  });

  test('Should throw Exception if provided date is not valid.', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'dateCheck').mockReturnValueOnce(false);

    const reqBody = {
      bookedDate: 'invalid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const expectedException = new InvalidParamException('bookedDate');

    await expect(() => sut.exec(reqBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if provided date is before today.', async () => {
    const { sut } = sutFactory;

    vi.spyOn(sut, 'isDateBeforeToday').mockReturnValueOnce(true);

    const reqBody = {
      bookedDate: 'before_today_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const expectedException = new PastDateException('Booked date provided');

    await expect(() => sut.exec(reqBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentAttatchmentRepository findById method with correct provided params.', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(establishmentAttatchmentRepositoryStub, 'findById');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(reqBody.establishmentAttatchmentId);
  });

  test('Should throw Exception if Establishment is not found.', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentAttatchmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const expectedException = new NotFoundException('Establishment attatchment');

    await expect(() => sut.exec(reqBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw Exception if userId provided is same as Establishment ownerId.', async () => {
    const { sut, establishmentAttatchmentRepositoryStub } = sutFactory;

    vi.spyOn(establishmentAttatchmentRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        establishmentId: 'any_establishment_id',
        createdAt: new Date(),
        updatedAt: new Date(),
        establishment: {
          id: 'any_establishment_id',
          name: 'any_name',
          ownerId: 'eq_establishment_attatchment_id',
        },
      }),
    );

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'eq_establishment_attatchment_id',
    };

    const expectedException = new ConflictException("An Establishment owner can't book dates on their own establishment.");

    const execError = sut.exec(reqBody);

    await expect(() => execError).rejects.toStrictEqual(expectedException);
  });

  test('Should call BookedDatesRepository findBookedDate with correct provided params', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'findBookedDate');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      attatchmentId: reqBody.establishmentAttatchmentId,
      bookedDate: reqBody.bookedDate,
    });
  });

  test('Should throw Exception if provided bookedDate is already filled on Establishment', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    vi.spyOn(bookedDatesRepositoryStub, 'findBookedDate').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        userId: 'any_user_id',
        bookedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        establishmentAttatchmentId: 'any_establishment_attatchment_id',
      }),
    );

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const expectedException = new AlreadyBookedException('Booked date provided');

    await expect(() => sut.exec(reqBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call UserRepository findById with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(userRepositoryStub, 'findById');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(reqBody.userId);
  });

  test('Should throw Exception if user not exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(reqBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call BookedDatesRepository save with correct provided params', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'save');

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    await sut.exec(reqBody);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(reqBody);
  });

  test('Should return new bookedDate id and bookedDate if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const reqBody = {
      bookedDate: 'valid_booked_date',
      establishmentAttatchmentId: 'valid_establishment_attatchment_id',
      userId: 'valid_user_id',
    };

    const sutResponse = await sut.exec(reqBody);

    expect(sutResponse).toEqual({
      id: 'any_id',
      bookedDate: 'converted_date',
    });
  });
});
