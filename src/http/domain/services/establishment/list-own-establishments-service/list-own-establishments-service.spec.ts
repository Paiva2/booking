import {
  beforeEach,
  describe, expect, test, vi,
} from 'vitest';
import { ListOwnEstablishmentsService } from './list-own-establishments-service';
import { EstablishmentRepository, UserRepository } from '../../../../data/repositories';
import { EstablishmentEntity, RegisterEstablishmentEntity, UserEntity } from '../../../entities';
import { EstablishmentTypes } from '../../../entities/enums';
import { MissingParamException, NotFoundException } from '../../../../presentation/exceptions';

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
    async findAllByUserId(params: {
      userId: string;
      page: number;
      perPage: number;
      orderBy: 'asc' | 'desc';
      name?: string | undefined;
    }): Promise<{ page: number; perPage: number; list: EstablishmentEntity[]; }> {
      return {
        page: 1,
        perPage: 5,
        list: [mockEstablishment],
      };
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
      throw new Error('Method not implemented.');
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
    async findByEmail(email: string): Promise<any> {
      throw new Error('Method not implemented.');
    }

    async save(user: any): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<UserEntity | null> {
      return mockUser;
    }

    async update(userUpdate: any): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }
  }

  return new UserRepositoryStub();
};

interface SutType {
  sut: ListOwnEstablishmentsService,
  establishmentRepositoryStub: EstablishmentRepository,
  userRepositoryStub: UserRepository
}

const makeSut = (): SutType => {
  const establishmentRepositoryStub = makeEstablishmentRepositoryStub();
  const userRepositoryStub = makeUserRepositoryStub();

  const sut = new ListOwnEstablishmentsService(userRepositoryStub, establishmentRepositoryStub);

  return {
    sut,
    establishmentRepositoryStub,
    userRepositoryStub,
  };
};

let sutFactory: SutType;

describe('ListOwnEstablishmentsService', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(args);
  });

  test('Should throw exception if userId is not provided to SUT', async () => {
    const { sut } = sutFactory;

    const args = {
      userId: '',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    const expectedException = new MissingParamException('userId');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findAllByUserId method with page as 1 if provide is 0', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '0',
      perPage: '5',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with page as 100 if provide is more than 100', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '110',
      perPage: '5',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 100,
      perPage: 5,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with page as 1 if page is not provided', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '',
      perPage: '5',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with perPage as 5 if perPage is not provided', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with perPage as 5 if perPage is less than 5', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '4',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with perPage as 5 if perPage is more than 100', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '110',
      orderBy: 'desc' as 'desc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 100,
    });
  });

  test('Should call EstablishmentRepository findAllByUserId method with orderBy as desc if orderBy is not provided', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: '' as 'desc' | 'asc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
      orderBy: 'desc',
    });
  });

  test('Should call UserRepository findById method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(userRepositoryStub, 'findById');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc' | 'asc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith(args.userId);
  });

  test('Should throw exception if userId provided is not found', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(
      Promise.resolve(null),
    );

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc' | 'asc',
      name: 'valid_name',
    };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.exec(args)).rejects.toStrictEqual(expectedException);
  });

  test('Should call EstablishmentRepository findAllByUserId method with correct provided params', async () => {
    const { sut, establishmentRepositoryStub } = sutFactory;

    const repositoryStub = vi.spyOn(establishmentRepositoryStub, 'findAllByUserId');

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc' | 'asc',
      name: 'valid_name',
    };

    await sut.exec(args);

    expect(repositoryStub).toHaveBeenCalledOnce();
    expect(repositoryStub).toHaveBeenCalledWith({
      ...args,
      page: 1,
      perPage: 5,
      orderBy: 'desc',
    });
  });

  test('Should return page, perPage and a list of filtered Establishments', async () => {
    const { sut } = sutFactory;

    const args = {
      userId: 'valid_user_id',
      page: '1',
      perPage: '5',
      orderBy: 'desc' as 'desc' | 'asc',
      name: 'valid_name',
    };

    const serviceResponse = await sut.exec(args);

    expect(serviceResponse).toEqual({
      page: 1,
      perPage: 5,
      list: [
        {
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
        },
      ],
    });
  });
});
