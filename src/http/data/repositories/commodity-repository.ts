import { CommodityEntity, CreateCommodityEntity, UpdateCommodityEntity } from '../../domain/entities';

export interface CommodityRepository {
  handleMultipleActions(args: {
    attatchmentId: string
    toDelete: string[] | null
    toCreate: CreateCommodityEntity[] | null
    toUpdate: UpdateCommodityEntity[] | null
  }): Promise<{
    inserted: CommodityEntity[] | null
    deleted: CommodityEntity[] | null
    updated: CommodityEntity[] | null
  }>

  findByNames(args: {
    names: string[],
    attatchmentId: string
  }): Promise<CommodityEntity | null>
}
