import { Controller, HttpResponse, HttpRequest } from '../../protocols';

export class UploadImagesController implements Controller {
  public async handle(req: HttpRequest): Promise<HttpResponse> {
    return {
      status: 200,
      data: [],
    };
  }

  dtoCheck(data: any): void {
    throw new Error('Method not implemented.');
  }
}
