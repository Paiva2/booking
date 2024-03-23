import { EstablishmentAttatchmentEntity } from '..';

export interface BookedDateEntity {
  id: string
  establishmentAttatchmentId: string
  userId: string
  bookedDate: Date
  createdAt: Date
  updatedAt: Date
  establishmentAttatchment?: EstablishmentAttatchmentEntity
}
