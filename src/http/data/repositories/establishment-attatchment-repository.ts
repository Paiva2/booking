import { EstablishmentAttatchmentEntity } from '../../domain/entities';

export interface EstablishmentAttatchmentRepository {
  findById(id: string): Promise<EstablishmentAttatchmentEntity | null>

  findByEstablishmentId(id: string): Promise<EstablishmentAttatchmentEntity | null>
}
