import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { NewBookDateService } from './new-book-date-service';
import { NewBookedDateEntity } from '../../../entities/booked-date/new-booked-date-entity';
import {
  BookedDatesRepository,
  EstablishmentAttatchmentRepository,
  UserRepository,
} from '../../../../data/repositories';
import {
  BookedDateEntity,
  CreateUserEntity,
  EstablishmentAttatchmentEntity,
  UpdateUserEntity,
  UserEntity,
} from '../../../entities';

const makeEstablishmentAttatchmentRepositoryStub = () => {
  class EstablishmentAttatchmentRepositoryStub implements EstablishmentAttatchmentRepository {
    async findById(id: string): Promise<EstablishmentAttatchmentEntity | null> {
      return {
        id: 'any_id',
        establishmentId: 'any_establishment_id',
        createdAt: new Date(),
        updatedAt: new Date(),
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
  vi.spyOn(sut, 'convertDateToView').mockImplementation(() => new Date().toISOString());

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
});
