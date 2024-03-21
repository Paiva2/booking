import { Controller, HttpResponse } from '../../protocols';

export class NewBookDateController implements Controller {
  public async handle(req: any): Promise<HttpResponse> {
    throw new Error('Method not implemented.');
  }

  dtoCheck(data: any): void {
    throw new Error('Method not implemented.');
  }
}
