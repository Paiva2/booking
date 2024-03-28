import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';
import {
  Controller, HttpRequest, HttpResponse, JwtHandler,
} from '../../protocols';

export class CreateOrDeleteEstablishmentImagesController implements Controller {
  public constructor(
    private readonly CreateOrDeleteEstablishmentImagesService: Service,
    private readonly jwtHandler: JwtHandler,
  ) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    this.dtoCheck({
      authToken: req.headers.authorization,
      toDelete: req.body.toDelete,
      toInsert: req.body.toInsert,
    });

    const parseUserId = this.jwtHandler.decode(req.headers.authorization.replaceAll('Bearer ', ''));

    const { toInsert, toDelete } = req.body;

    const handleImages = await this.CreateOrDeleteEstablishmentImagesService.exec({
      userId: parseUserId,
      establishmentId: req.params.establishmentId,
      toInsert,
      toDelete,
    });

    return {
      status: 201,
      data: handleImages,
    };
  }

  dtoCheck(data: { authToken: string, toDelete: string[], toInsert: string[] }): void {
    if (!data.authToken) {
      throw new MissingParamException('authToken');
    }

    if (!data.toDelete?.length && !data.toInsert?.length) {
      throw new MissingParamException('toDelete or toInsert');
    }
  }
}
