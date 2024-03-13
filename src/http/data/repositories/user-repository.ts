import { CreateUserEntity, UserEntity, UpdateUserEntity } from '../../domain/entities';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;

  save(user: CreateUserEntity): Promise<UserEntity>;

  findById(id: string): Promise<UserEntity | null>;

  update(userUpdate: UpdateUserEntity): Promise<UserEntity>
}
