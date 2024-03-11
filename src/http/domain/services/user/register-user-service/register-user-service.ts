import { CreateUserEntity, UserEntity } from '../../../../data/entities';
import { AlreadyExistsException, InvalidParamException } from '../../../../exceptions';
import { contactValidator, emailValidator, postalCodeValidator } from '../../../utils';
import { UserRepository } from '../../../../data/repositories/user-repository';
import { Service } from '../../../protocols/service';

export class RegisterUserService implements Service {
  public constructor(private readonly userRepository: UserRepository) {}

  public async exec(dto: CreateUserEntity): Promise<UserEntity> {
    if (!this.emailCheck(dto.email)) {
      throw new InvalidParamException('email');
    }

    if (!this.postalCodeCheck(dto.adddress.zipcode)) {
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

    const newUser = await this.userRepository.save(dto);

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
