import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { UpdateUserService } from '..';
import { UserRepository } from '../../../../data/repositories';
import { UserEntity, CreateUserEntity, UpdateUserEntity } from '../../../entities';
import { Encrypter } from '../../../protocols';

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async hash(string: string): Promise<string> {
      return 'valid_hashed_password';
    }

    async compare(base: string, encrypted: string): Promise<boolean> {
      return true;
    }
  }

  return new EncrypterStub();
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
      return {} as UserEntity;
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return {} as UserEntity;
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

interface SutTypes {
  sut: UpdateUserService,
  userRepositoryStub: UserRepository,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const encrypterStub = makeEncrypterStub();

  const sut = new UpdateUserService(userRepositoryStub, encrypterStub);

  vi.spyOn(sut, 'emailCheck').mockReturnValue(true);
  vi.spyOn(sut, 'contactCheck').mockReturnValue(true);
  vi.spyOn(sut, 'postalCodeCheck').mockReturnValue(true);

  return {
    sut,
    userRepositoryStub,
    encrypterStub,
  };
};

let sutFactory: SutTypes;

describe('Update user profile controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call UpdateUserService exec method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'exec');

    const requestBody = {
      userId: 'valid_id',
      name: 'updated_name',
      email: 'valid_email',
    };

    await sut.exec(requestBody);

    expect(spySut).toHaveBeenCalledWith(requestBody);
  });
});
