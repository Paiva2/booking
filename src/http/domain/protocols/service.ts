export interface Service {
  exec(dto: any): Promise<any>
}
