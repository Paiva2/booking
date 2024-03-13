import { ClientUserEntity, UpdateUserEntity } from '../../../entities';
import { contactValidator, emailValidator, postalCodeValidator } from '../../../utils';
import { AlreadyExistsException, InvalidParamException, NotFoundException } from '../../../../presentation/exceptions';
import { UserRepository } from '../../../../data/repositories';
import { Encrypter, Service } from '../../../protocols';

export class UpdateUserService implements Service {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  public async exec(dto: UpdateUserEntity): Promise<ClientUserEntity> {
    if (dto.zipcode && !this.postalCodeCheck(dto.zipcode)) {
      throw new InvalidParamException('zipcode');
    }

    if (dto.contact && !this.contactCheck(dto.contact)) {
      throw new InvalidParamException('contact');
    }

    let dtoParamCopy = { ...dto };

    if (dto.password) {
      if (dto.password.length < 6) {
        throw new InvalidParamException('password');
      }

      const hashPassword = await this.encrypter.hash(dto.password);

      dtoParamCopy = {
        ...dtoParamCopy,
        password: hashPassword,
      };
    }

    const doesUserExists = await this.userRepository.findById(dto.userId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    if (dto.email) {
      if (!this.emailCheck(dto.email)) {
        throw new InvalidParamException('email');
      }

      const doesEmailAlreadyExists = await this.userRepository.findByEmail(dto.email);

      if (doesEmailAlreadyExists && doesEmailAlreadyExists.email !== doesUserExists.email) {
        throw new AlreadyExistsException('E-mail');
      }
    }

    const updateUser = await this.userRepository.update(dtoParamCopy);

    return updateUser;
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
