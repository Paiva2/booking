import {
  BookedDateEntity, CommodityEntity, EstablishmentEntity, EstablishmentImageEntity,
} from '..';

export interface EstablishmentAttatchmentEntity {
  id: string
  establishmentId?: string
  createdAt?: Date
  updatedAt?: Date
  establishment?: Omit<EstablishmentEntity, 'establishmentAttatchment'>
  commodities?: Pick<CommodityEntity, 'id' | 'name' | 'commodityIconUrl'>[]
  images?: Pick<EstablishmentImageEntity, 'id' | 'url'>[]
  bookedDates?: Pick<BookedDateEntity, 'id' | 'userId' | 'bookedDate'>[]
}
