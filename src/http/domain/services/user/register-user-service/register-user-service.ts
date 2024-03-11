import { UserRepository } from '../../../../data/repositories/user-repository';
import { AlreadyExistsException, InvalidParamException } from '../../../../exceptions';
import { contactValidator, emailValidator, postalCodeValidator } from '../../../utils';

interface RegisterUserServiceRequest {
  name:string,
  email: string,
  password:string,
  contact:string,
  adddress: {
    street:string,
    zipcode: string,
    neighbourhood:string,
    number:string,
    complement:string,
    state:string,
    city:string,
  }
}

interface RegisterUserServiceResponse {}

export class RegisterUserService {
  public constructor(private readonly userRepository?: UserRepository) {}

  public async exec(dto: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
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

    const doesUserAlreadyExists = await this.userRepository?.findByEmail(dto.email);

    if (doesUserAlreadyExists) {
      throw new AlreadyExistsException('User');
    }
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
