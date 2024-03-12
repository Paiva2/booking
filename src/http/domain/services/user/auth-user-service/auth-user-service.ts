import { AuthUserEntity, UserEntity } from '../../../entities';
import { Service } from '../../../protocols';

export class AuthUserService implements Service {
  public async exec(dto: AuthUserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
