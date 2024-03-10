import { HttpRequest, HttpResponse } from '.';

export interface Controller {
  handle(req: HttpRequest, res: HttpResponse): Promise<HttpResponse>
  dtoCheck(data: Pick<HttpRequest, 'body'>): void;
}
