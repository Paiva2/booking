import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class FilterEstablishmentController implements Controller {
  public constructor(private readonly filterEstablishmentService: Service) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck(req.params);

    const { establishmentId } = req.params;

    const filterEstablishment = await this.filterEstablishmentService.exec(
      establishmentId,
    );

    return {
      status: 200,
      data: filterEstablishment,
    };
  }

  dtoCheck(data: { establishmentId: string }): void {
    if (!data.establishmentId) {
      throw new MissingParamException('establishmentId');
    }
  }
}
