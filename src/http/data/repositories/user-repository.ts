import { CreateUserEntity, UserEntity } from '../entities';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;

  save(user: CreateUserEntity): Promise<UserEntity>;
}
