import { EstablishmentEntity, RegisterEstablishmentEntity } from '../../domain/entities';
import { UpdateEstablishmentEntity } from '../../domain/entities/establishment/update-establishment-entity';

export interface EstablishmentRepository {
  save(dto: {
    userId: string,
    establishment: RegisterEstablishmentEntity
  }): Promise<EstablishmentEntity>;

  findByName(dto: {
    userId: string,
    name: string
  }): Promise<EstablishmentEntity | null>

  find(query: {
    page: number,
    perPage: number,
    name?: string,
    state?: string,
    city?: string,
  }): Promise<{
    page: number,
    perPage: number,
    list: EstablishmentEntity[]
  }>

  findById(id: string): Promise<EstablishmentEntity | null>

  findAllByUserId(params: {
    userId: string,
    page: number,
    perPage: number,
    orderBy: 'asc' | 'desc'
    name?: string,
  }): Promise<{
    page: number,
    perPage: number,
    list: EstablishmentEntity[]
  }>

  update(dto: { ownerId: string, args: UpdateEstablishmentEntity }): Promise<EstablishmentEntity>

}
