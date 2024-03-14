import {
  test,
  describe,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import { GetUserProfileController } from './get-user-profile-controller';
import { UserEntity, CreateUserEntity, UpdateUserEntity } from '../../../domain/entities';
import { MissingParamException, NotFoundException } from '../../exceptions';
import { UserRepository } from '../../../data/repositories';
import { JwtHandler } from '../../protocols';

const makeJwtHandlerStub = () => {
  class JwtHandlerStub implements JwtHandler {
    sign(subject: string): string {
      return 'valid_token';
    }

    decode(token: string): string {
      return 'valid_subject_from_token';
    }
  }

  return new JwtHandlerStub();
};

const makeUserRepositoryStub = () => {
  const mockUser = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    contact: 'any_contact',
    password: 'any_password',
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
    async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
      throw new Error('Method not implemented.');
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
      return mockUser;
    }

    async save(user: CreateUserEntity): Promise<UserEntity> {
      return mockUser;
    }

    async findById(email: string): Promise<UserEntity | null> {
      return mockUser;
    }
  }

  return new UserRepositoryStub();
};

interface SutTypes {
  sut: GetUserProfileController
  userRepositoryStub: UserRepository,
  jwtHandlerStub: JwtHandler
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const jwtHandlerStub = makeJwtHandlerStub();

  const sut = new GetUserProfileController(userRepositoryStub, jwtHandlerStub);

  return {
    sut,
    userRepositoryStub,
    jwtHandlerStub,
  };
};

let sutFactory: SutTypes;

describe('Get user profile controller', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call controller with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestHeader = { authorization: 'valid_token' };

    await sut.handle(requestHeader);

    expect(spySut).toHaveBeenCalledWith(requestHeader);
  });

  test('Should throw an error if authorization token is not provided', async () => {
    const { sut } = sutFactory;

    const requestHeader = { authorization: '' };

    const expectedException = new MissingParamException('auth token');

    await expect(() => sut.handle(requestHeader)).rejects.toStrictEqual(expectedException);
  });

  test('Should call JwtHandler decode method with correct provided params', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyJwtHandlerStub = vi.spyOn(jwtHandlerStub, 'decode');

    const requestHeader = { authorization: 'valid_token' };

    await sut.handle(requestHeader);

    expect(spyJwtHandlerStub).toHaveBeenCalledWith(requestHeader.authorization);
  });

  test('Should call JwtHandler decode method without Bearer prefix on Authorization Header', async () => {
    const { sut, jwtHandlerStub } = sutFactory;

    const spyJwtHandlerStub = vi.spyOn(jwtHandlerStub, 'decode');

    const requestHeader = { authorization: 'Bearer valid_token' };

    await sut.handle(requestHeader);

    expect(spyJwtHandlerStub).toHaveBeenCalledWith(requestHeader.authorization.replaceAll('Bearer ', ''));
  });

  test('Should call UserRepository findById method with correct provided params', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    const spyUserRepositoryStub = vi.spyOn(userRepositoryStub, 'findById');

    const requestHeader = { authorization: 'valid_token' };

    await sut.handle(requestHeader);

    expect(spyUserRepositoryStub).toHaveBeenCalledWith('valid_subject_from_token');
  });

  test('Should throw an error if user provided doesnt exists', async () => {
    const { sut, userRepositoryStub } = sutFactory;

    vi.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null));

    const requestHeader = { authorization: 'valid_token' };

    const expectedException = new NotFoundException('User');

    await expect(() => sut.handle(requestHeader)).rejects.toStrictEqual(expectedException);
  });

  test('Should return an ClientUserEntity if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestHeader = { authorization: 'valid_token' };

    const response = await sut.handle(requestHeader);

    expect(response).toEqual({
      status: 200,
      data: {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        contact: 'any_contact',
        neighbourhood: 'any_neighbourhood',
        street: 'any_street',
        city: 'any_city',
        state: 'any_state',
        number: 'any_number',
        complement: 'any_complement',
        zipcode: 'any_zipcode',
      },
    });
  });
});
