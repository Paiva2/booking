import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { ListBookedDatesService } from '..';
import { BookedDatesRepository, UserRepository } from '../../../../data/repositories';
import { BookedDateEntity, UserEntity } from '../../../entities';
import { NotFoundException } from '../../../../presentation/exceptions';

const makeUserRepositoryStub = () => {
  const clientUserEntity = {
    id: 'any_id',
    name: 'any_name',
    email: 'any@email.com',
    contact: 'any_contact',
    password: 'any_hashed_password',
    neighbourhood: 'any_neighbourhood',
    street: 'any_street',
    city: 'any_city',
    state: 'any_state',
    number: 'any_number',
    complement: 'any_complement',
    zipcode: 'any_zipcode',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class UserRepositoryStub implements UserRepository {
    async findByEmail(email: string): Promise<UserEntity | null> {
      throw new Error('Method not implemented.');
    }

    async update(userUpdate: any): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }

    async save(_: any): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }

    async findById(_: string): Promise<UserEntity | null> {
      return clientUserEntity;
    }
  }

  return new UserRepositoryStub();
};

const makeBookedDatesRepositoryStub = () => {
  class BookedDatesRepositoryStub implements BookedDatesRepository {
    async findAllFromUser(params: { page: number;
      perPage: number;
      userId: string;
    }): Promise<{ page: number; perPage: number; list: BookedDateEntity[]; }> {
      return {
        page: 1,
        perPage: 5,
        list: [
          {
            id: 'any_id',
            establishmentAttatchmentId: 'valid_establishment_attatchment_id',
            userId: 'valid_user_id',
            bookedDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
    }

    async findBookedDate(params: {
      attatchmentId: string;
      bookedDate: string;
    }): Promise<BookedDateEntity | null> {
      throw new Error('Method not implemented.');
    }

    async save(create: any): Promise<BookedDateEntity> {
      throw new Error('Method not implemented.');
    }
  }

  return new BookedDatesRepositoryStub();
};

interface SutType {
  sut: ListBookedDatesService,
  bookedDatesRepositoryStub: BookedDatesRepository
  userRepositoryStub: UserRepository
}

const makeSut = () => {
  const bookedDatesRepositoryStub = makeBookedDatesRepositoryStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const sut = new ListBookedDatesService(userRepositoryStub, bookedDatesRepositoryStub);

  return {
    sut,
    bookedDatesRepositoryStub,
    userRepositoryStub,
  };
};

let sutFactory: SutType;

describe('ListBookedDatesService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call ListBookedDatesService exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const args = {
      page: '1',
      perPage: '5',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(args);
  });

  test('Should call UserRepository findById method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(userRepositoryStub, 'findById');

    const args = {
      page: '1',
      perPage: '5',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith(args.userId);
  });

  test('Should throw Exception if provided userId doesnt exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const args = {
      page: '1',
      perPage: '5',
      userId: 'valid_user_id',
    };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call bookedDateRepository findAllFromUser method with correct provided params', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'findAllFromUser');

    const args = {
      page: '1',
      perPage: '5',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      userId: args.userId,
    });
  });

  test('Should call bookedDateRepository findAllFromUser method with page 1 if provided is 0', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'findAllFromUser');

    const args = {
      page: '0',
      perPage: '5',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      userId: args.userId,
    });
  });

  test('Should call bookedDateRepository findAllFromUser method with perPage 100 if provided is more than 100', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'findAllFromUser');

    const args = {
      page: '1',
      perPage: '101',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      page: 1,
      perPage: 100,
      userId: args.userId,
    });
  });

  test('Should call bookedDateRepository findAllFromUser method with perPage 100 if provided is less than 5', async () => {
    const { sut, bookedDatesRepositoryStub } = sutFactory;

    const spyRepository = vi.spyOn(bookedDatesRepositoryStub, 'findAllFromUser');

    const args = {
      page: '1',
      perPage: '4',
      userId: 'valid_user_id',
    };

    await sut.exec(args);

    expect(spyRepository).toHaveBeenCalledOnce();
    expect(spyRepository).toHaveBeenCalledWith({
      page: 1,
      perPage: 5,
      userId: args.userId,
    });
  });

  test('Should return page, perPage and list of bookedDates if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const args = {
      page: '1',
      perPage: '5',
      userId: 'valid_user_id',
    };

    const serviceResponse = await sut.exec(args);

    expect(serviceResponse).toEqual({
      page: 1,
      perPage: 5,
      list: [
        {
          id: 'any_id',
          establishmentAttatchmentId: 'valid_establishment_attatchment_id',
          userId: 'valid_user_id',
          bookedDate: expect.any(Date),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    });
  });
});
