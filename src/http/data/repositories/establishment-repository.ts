import { EstablishmentEntity, RegisterEstablishmentEntity } from '../../domain/entities';

export interface EstablishmentRepository {
  save(dto: {
    userId: string,
    establishment: RegisterEstablishmentEntity }): Promise<EstablishmentEntity>;

  findByName(dto: {
    userId: string,
    name: string }): Promise<EstablishmentEntity | null>
}
