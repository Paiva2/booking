import { UserEntity, CreateUserEntity } from '../../domain/entities';
import { UserRepository } from '../repositories';

export class UserModel implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }

  async save(user: CreateUserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
