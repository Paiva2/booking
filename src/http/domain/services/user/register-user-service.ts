import { UserRepository } from '../../../data/repositories/user-repository';

interface RegisterUserServiceRequest {
  name:string,
  email: string,
  password:string,
  contact:string,
  adddress: {
    street:string,
    neighbourhood:string,
    number:string,
    complement:string,
    state:string,
    city:string
  }
}

interface RegisterUserServiceResponse {}

export class RegisterUserService {
  public constructor(private readonly userRepository?: UserRepository) {}

  async exec(dto: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {}
}
