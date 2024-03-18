export interface HttpRequest {
  body?: any,
  authorization?: any
  params?: any,
  query?: any
  headers?: any
}

export interface HttpResponse {
  status: number,
  data: any
}
