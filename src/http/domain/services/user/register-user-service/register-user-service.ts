import { CreateUserEntity, UserEntity } from '../../../../data/entities';
import { AlreadyExistsException, InvalidParamException } from '../../../../exceptions';
import { contactValidator, emailValidator, postalCodeValidator } from '../../../utils';
import { UserRepository } from '../../../../data/repositories/user-repository';
import { Encrypter, Service } from '../../../protocols';

export class RegisterUserService implements Service {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  public async exec(dto: CreateUserEntity): Promise<UserEntity> {
    if (!this.emailCheck(dto.email)) {
      throw new InvalidParamException('email');
    }

    if (!this.postalCodeCheck(dto.address.zipcode)) {
      throw new InvalidParamException('zipcode');
    }

    if (!this.contactCheck(dto.contact)) {
      throw new InvalidParamException('contact');
    }

    if (dto.password.length < 6) {
      throw new InvalidParamException('password');
    }

    const doesUserAlreadyExists = await this.userRepository.findByEmail(dto.email);

    if (doesUserAlreadyExists) {
      throw new AlreadyExistsException('User');
    }

    const hashPassword = await this.encrypter.hash(dto.password);

    const newUser = await this.userRepository.save({
      ...dto,
      password: hashPassword,
    });

    return newUser;
  }

  emailCheck(email:string): boolean {
    return emailValidator(email);
  }

  postalCodeCheck(postalCode:string): boolean {
    return postalCodeValidator(postalCode);
  }

  contactCheck(contact:string): boolean {
    return contactValidator(contact);
  }
}
