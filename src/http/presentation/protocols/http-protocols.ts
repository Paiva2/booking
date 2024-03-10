export interface HttpRequest {
  body: any,
  authorization?: any
  params?:any,
  query?:any
}

export interface HttpResponse {
  status: number,
  data: any
}
