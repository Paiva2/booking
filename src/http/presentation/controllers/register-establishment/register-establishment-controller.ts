import {
  Controller,
  HttpRequest,
  HttpResponse,
  JwtHandler,
} from '../../protocols';
import { RegisterEstablishmentEntity } from '../../../domain/entities';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';

export class RegisterEstablishmentController implements Controller {
  public constructor(
    private readonly registerEstablishmentService: Service,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle({ body, headers }: HttpRequest): Promise<HttpResponse> {
    const getUserId = this.jwtHandler.decode(headers.authorization.replace('Bearer ', ''));

    const establishment = body;

    this.dtoCheck({
      establishment,
      userId: getUserId,
    });

    await this.registerEstablishmentService.exec({
      userId: getUserId,
      establishment,
    });

    return {
      status: 201,
      data: 'New establishment registered successfully.',
    };
  }

  dtoCheck(data: { userId: string, establishment: RegisterEstablishmentEntity }): void {
    const { establishment, userId } = data;

    if (!userId) {
      throw new MissingParamException('userId');
    }

    if (!establishment.images || !establishment.images.length) {
      throw new MissingParamException('images');
    }

    const requiredFields = [
      'type',
      'name',
      'description',
      'contact',
      'street',
      'neighbourhood',
      'zipcode',
      'number',
      'city',
      'state',
      'country',
      'maxBookingHour',
      'minBookingHour',
    ];

    const bodyFields = Object.keys(data.establishment);

    for (const field of requiredFields) {
      if (!bodyFields.includes(field)) {
        throw new MissingParamException(field);
      }
    }
  }
}
