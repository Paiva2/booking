import { CommodityEntity, EstablishmentEntity, EstablishmentImageEntity } from '..';

export interface EstablishmentAttatchmentEntity {
  id: string
  establishmentId?: string
  createdAt?: Date
  updatedAt?: Date
  establishment?: Omit<EstablishmentEntity, 'establishmentAttatchment'>
  images?: EstablishmentImageEntity[]
  commodities?: CommodityEntity[]
}
