import { randomUUID } from 'crypto';
import { UserEntity, CreateUserEntity } from '../../domain/entities';
import { UserRepository } from '../repositories';

export class InMemoryUserModel implements UserRepository {
  public users:UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async save(user: CreateUserEntity): Promise<UserEntity> {
    const newUser:UserEntity = {
      id: randomUUID(),
      email: user.email,
      name: user.name,
      password: user.password,
      street: user.address.street,
      city: user.address.city,
      complement: user.address.complement,
      zipcode: user.address.zipcode,
      contact: user.contact,
      neighbourhood: user.address.neighbourhood,
      number: user.address.number,
      state: user.address.state,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  findById(email: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
}
