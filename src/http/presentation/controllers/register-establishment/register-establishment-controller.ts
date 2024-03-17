import { RegisterEstablishmentEntity } from '../../../domain/entities';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class RegisterEstablishmentController implements Controller {
  public constructor(private readonly registerEstablishmentService: Service) {}

  public async handle({ body }: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(body);

    await this.registerEstablishmentService.exec({
      userId: body.userId,
      establishment: body.establishment,
    });

    return {
      status: 201,
      data: 'New establishment registered successfully.',
    };
  }

  dtoCheck(data: { userId: string, establishment: RegisterEstablishmentEntity }): void {
    if (!data.userId) {
      throw new MissingParamException('userId');
    }

    if (!data.establishment.images || !data.establishment.images.length) {
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
