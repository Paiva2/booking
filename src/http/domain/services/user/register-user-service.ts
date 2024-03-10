import { UserRepository } from '../../../data/repositories/user-repository';

interface RegisterUserServiceRequest {}

interface RegisterUserServiceResponse {}

export class RegisterUserService {
  public constructor(private readonly userRepository: UserRepository) {}

  async exec(dto: RegisterUserServiceRequest):Promise<RegisterUserServiceResponse> {}
}
