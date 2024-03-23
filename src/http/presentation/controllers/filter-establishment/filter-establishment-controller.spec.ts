import {
  beforeEach, describe, expect, test, vi,
} from 'vitest';
import { FilterEstablishmentController } from './filter-establishment-controller';
import { Service } from '../../../domain/protocols';
import { EstablishmentTypes } from '../../../domain/entities/enums';
import { MissingParamException } from '../../exceptions';

const makeFilterEstablishmentServiceStub = () => {
  class FilterEstablishmentServiceStub implements Service {
    async exec(dto: any): Promise<any> {
      return {
        id: 'any_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        ownerId: 'any_ownerId',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        zipcode: 'any_zipcode',
        number: 'any_number',
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        complement: 'any_complement',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return new FilterEstablishmentServiceStub();
};

interface SutType {
  sut: FilterEstablishmentController
  filterEstablishmentServiceStub: Service
}

const makeSut = (): SutType => {
  const filterEstablishmentServiceStub = makeFilterEstablishmentServiceStub();
  const sut = new FilterEstablishmentController(filterEstablishmentServiceStub);

  return {
    sut,
    filterEstablishmentServiceStub,
  };
};

let sutFactory: SutType;

describe('FilterEstablishmentController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call SUT handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestBody = {
      params: {
        establishmentId: 'valid_establishment_id',
      },
    };

    await sut.handle(requestBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should call SUT dtoCheck method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'dtoCheck');

    const requestBody = {
      params: {
        establishmentId: 'valid_establishment_id',
      },
    };

    await sut.handle(requestBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(requestBody.params);
  });

  test('Should throw exception if establishmentId is not provided on params', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      params: {},
    };

    const expectedException = new MissingParamException('establishmentId');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call Service exec method with correct provided params', async () => {
    const { sut, filterEstablishmentServiceStub } = sutFactory;

    const spyService = vi.spyOn(filterEstablishmentServiceStub, 'exec');

    const requestBody = {
      params: {
        establishmentId: 'valid_establishment_id',
      },
    };

    await sut.handle(requestBody);

    expect(spyService).toHaveBeenCalledOnce();
    expect(spyService).toHaveBeenCalledWith(requestBody.params.establishmentId);
  });

  test('Should return 200 and data with filtered Establishment if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      params: {
        establishmentId: 'valid_establishment_id',
      },
    };

    const response = await sut.handle(requestBody);

    expect(response).toEqual({
      status: 200,
      data: {
        id: 'any_id',
        type: EstablishmentTypes.APARTMENT,
        name: 'any_name',
        description: 'any_description',
        ownerId: 'any_ownerId',
        street: 'any_street',
        neighbourhood: 'any_neighbourhood',
        zipcode: 'any_zipcode',
        number: 'any_number',
        city: 'any_city',
        state: 'any_state',
        country: 'any_country',
        complement: 'any_complement',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
