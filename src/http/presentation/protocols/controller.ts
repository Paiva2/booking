import { HttpRequest, HttpResponse } from '.';

export interface Controller {
  handle(req: any): Promise<HttpResponse>
  dtoCheck(data: Pick<HttpRequest, 'body'>): void;
}
