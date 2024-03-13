import { HttpRequest, HttpResponse } from './http-protocols';

export interface Controller {
  handle(req: any): Promise<HttpResponse>
  dtoCheck(data: any): void;
}
