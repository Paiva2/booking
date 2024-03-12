import { UserEntity, CreateUserEntity } from '../../domain/entities';
import { UserRepository } from '../repositories';
import prisma from '../lib/prisma';

export class UserModel implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const find = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return find;
  }

  async save(user: CreateUserEntity): Promise<UserEntity> {
    const createUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        city: user.address.city,
        complement: user.address.complement,
        contact: user.contact,
        neighbourhood: user.address.neighbourhood,
        number: user.address.number,
        state: user.address.state,
        zipcode: user.address.zipcode,
      },
    });

    return createUser;
  }
}
