import { EstablishmentImageEntity } from '../../domain/entities';

export interface EstablishmentImagesRepository {
  createOrDelete(args: {
    toInsert: string[] | null
    toDelete: string[] | null
    establishmentAttatchmentId: string
  }): Promise<{
    inserted: EstablishmentImageEntity[] | null
    deleted: EstablishmentImageEntity[] | null
  }>
}
