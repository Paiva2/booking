import { Request } from 'express';

export interface HttpRequest {
  body: any
}

export interface HttpResponse {
  status: number,
  data: any
}
