import { UserRepository } from '../../../../data/repositories';
import { InvalidParamException, NotFoundException, WrongCredentialsException } from '../../../../presentation/exceptions';
import { AuthUserEntity, UserEntity } from '../../../entities';
import { Encrypter, Service } from '../../../protocols';
import { emailValidator } from '../../../utils';

export class AuthUserService implements Service {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  public async exec(dto: AuthUserEntity): Promise<UserEntity> {
    if (!this.emailCheck(dto.email)) {
      throw new InvalidParamException('email');
    }

    const doesUserExists = await this.userRepository.findByEmail(dto.email);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const doesPasswordsMatches = await this.encrypter.compare(
      dto.password,
      doesUserExists.password,
    );

    if (!doesPasswordsMatches) {
      throw new WrongCredentialsException();
    }

    return doesUserExists;
  }

  emailCheck(email:string): boolean {
    return emailValidator(email);
  }
}
