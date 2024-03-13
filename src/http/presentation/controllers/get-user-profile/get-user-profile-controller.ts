import { UserRepository } from '../../../data/repositories';
import { ClientUserEntity } from '../../../domain/entities';
import { MissingParamException, NotFoundException } from '../../exceptions';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';

export class GetUserProfileController implements Controller {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtHandler: JwtHandler,
  ) {}

  async handle(token: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(token.authorization);

    const getUserId = this.jwtHandler.decode(token.authorization.replaceAll('Bearer ', ''));

    const doesUserExists = await this.userRepository.findById(getUserId);

    if (!doesUserExists) {
      throw new NotFoundException('User');
    }

    const userFieldsToClient: ClientUserEntity = {
      id: doesUserExists.id,
      name: doesUserExists.name,
      email: doesUserExists.email,
      street: doesUserExists.street,
      city: doesUserExists.city,
      state: doesUserExists.state,
      zipcode: doesUserExists.zipcode,
      complement: doesUserExists.complement,
      contact: doesUserExists.contact,
      neighbourhood: doesUserExists.neighbourhood,
      number: doesUserExists.number,
    };

    return {
      status: 200,
      data: userFieldsToClient,
    };
  }

  dtoCheck(data: string): void {
    if (!data) {
      throw new MissingParamException('auth token');
    }
  }
}
