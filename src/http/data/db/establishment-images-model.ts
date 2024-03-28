import { Prisma } from '@prisma/client';
import { EstablishmentImageEntity } from '../../domain/entities';
import prisma from '../lib/prisma';
import { EstablishmentImagesRepository } from '../repositories/establishment-images-repository';

export class EstablishmentImagesModel implements EstablishmentImagesRepository {
  public async createOrDelete(args: {
    toInsert: string[] | null
    toDelete: string[] | null
    establishmentAttatchmentId: string
  }): Promise<{
      inserted: EstablishmentImageEntity[] | null
      deleted: EstablishmentImageEntity[] | null
    }> {
    let inserted = null;
    let deleted = null;

    try {
      await prisma.$transaction(async (tx) => {
        if (args.toInsert?.length) {
          inserted = await prisma.establishmentImage.createMany({
            data: args.toInsert?.map((url) => ({
              url,
              establishmentAttatchmentId: args.establishmentAttatchmentId,
            })),
          });
        }

        if (args.toDelete?.length) {
          deleted = await prisma.establishmentImage.deleteMany({
            where: {
              id: {
                in: args.toDelete,
              },
            },
          });
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        throw new Error(err.message);
      }
    }

    return {
      inserted,
      deleted,
    };
  }
}
