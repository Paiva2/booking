import { MissingParamException } from '../../exceptions';
import { Controller, HttpResponse, HttpRequest } from '../../protocols';
import { Service } from '../../../domain/protocols';

export class UploadImagesController implements Controller {
  public constructor(private readonly uploadImagesService: Service) {}

  public async handle(req: HttpRequest): Promise<HttpResponse> {
    const args = {
      files: req.files,
      query: req.query,
      iconMapper: req.body.iconMapper,
    };

    this.dtoCheck(args);

    if (args.iconMapper && args.query.type === 'commodity') {
      args.iconMapper = JSON.parse(args.iconMapper)
        .map((icon: { idx: string, name: string }) => ({
          idx: Number(icon.idx),
          name: icon.name,
        }));
    }

    const response = await this.uploadImagesService.exec(args);

    return {
      status: 201,
      data: response,
    };
  }

  dtoCheck(data: { files: [], query: { type: string }, iconMapper: [] }): void {
    if (!data.files || !data.files.length) {
      throw new MissingParamException('files');
    }

    if (data.query.type === 'commodity') {
      if (!data.iconMapper || !data.iconMapper.length) {
        throw new MissingParamException('iconMapper');
      }
    }
  }
}
