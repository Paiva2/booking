import { EstablishmentEntity, RegisterEstablishmentEntity } from '../../domain/entities';

export interface EstablishmentRepository {
  save(dto: {
    userId: string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity>;

  findByName(dto: {
    userId: string,
    name: string }): Promise<EstablishmentEntity | null>

  find(query: {
    page: string,
    perPage: string,
    name?: string,
    state?: string,
    city?: string,
  }):Promise<{
    page: number,
    perPage: number,
    list: EstablishmentEntity[]
  }>
}
