import { EstablishmentEntity, RegisterEstablishmentEntity } from '../../domain/entities';

export interface EstablishmentRepository {
  save(dto: {
    userId: string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity>;

  findByName(dto: {
    userId: string,
    name: string }): Promise<EstablishmentEntity | null>

  find(query: {
    page: number,
    perPage: number,
    name?: string,
    state?: string,
    city?: string,
  }):Promise<{
    page: number,
    perPage: number,
    list: EstablishmentEntity[]
  }>

  findById(id: string): Promise<EstablishmentEntity | null>
}
