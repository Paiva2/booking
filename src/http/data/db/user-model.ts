import { UserEntity, CreateUserEntity, UpdateUserEntity } from '../../domain/entities';
import { UserRepository } from '../repositories';
import prisma from '../lib/prisma';

export class UserModel implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const find = await prisma.user.findUnique({
      where: {
        email,
      },
    }) as UserEntity | null;

    return find;
  }

  async save(user: CreateUserEntity): Promise<UserEntity> {
    const createUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        street: user.address.street,
        city: user.address.city,
        complement: user.address.complement,
        contact: user.contact,
        neighbourhood: user.address.neighbourhood,
        number: user.address.number,
        state: user.address.state,
        zipcode: user.address.zipcode,
      },
    }) as UserEntity;

    return createUser;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const find = await prisma.user.findFirst({
      where: {
        id,
      },
    }) as UserEntity | null;

    return find;
  }

  async update(userUpdate: UpdateUserEntity): Promise<UserEntity> {
    const idKey = 'userId';

    const { [idKey]: userId, ...userUpdateFields } = userUpdate;

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { ...userUpdateFields },
    }) as UserEntity;

    return updateUser;
  }
}
