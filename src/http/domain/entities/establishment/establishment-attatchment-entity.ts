export interface EstablishmentAttatchmentEntity {
  id: string
  establishmentId?: string
  createdAt?: Date
  updatedAt?: Date
  establishment?: { id: string, ownerId: string, name: string }
}
