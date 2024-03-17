import {
  test, describe, beforeEach, vi, expect,
} from 'vitest';
import { RegisterEstablishmentController } from './register-establishment-controller';
import { Controller } from '../../protocols';
import { Service } from '../../../domain/protocols';
import { MissingParamException } from '../../exceptions';

const makeRegisterEstablishmentServiceStub = () => {
  class RegisterEstablishmentServiceStub implements Service {
    async exec(dto: {}): Promise<{}> {
      return {};
    }
  }

  return new RegisterEstablishmentServiceStub();
};

interface SutTypes {
  sut: Controller
  registerEstablishmentServiceStub: Service
}

const makeSut = (): SutTypes => {
  const registerEstablishmentServiceStub = makeRegisterEstablishmentServiceStub();
  const sut = new RegisterEstablishmentController(registerEstablishmentServiceStub);

  return {
    sut,
    registerEstablishmentServiceStub,
  };
};

let sutFactory: SutTypes;

describe('RegisterEstablishmentController', () => {
  beforeEach(() => {
    sutFactory = makeSut();
  });

  test('Should call RegisterEstablishmentController handle method with correct provided params', async () => {
    const { sut } = sutFactory;

    const spySut = vi.spyOn(sut, 'handle');

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    await sut.handle(requestBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith(requestBody);
  });

  test('Should throw exception if userId is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        establishment: {
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('userId');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if type is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('type');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if name is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('name');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if description is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('description');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if contact is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('contact');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if street is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('street');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if neighbourhood is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('neighbourhood');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if zipcode is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('zipcode');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if number is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          zipcode: 'valid_zipcode',
          neighbourhood: 'valid_neighbourhood',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('number');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if city is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          zipcode: 'valid_zipcode',
          neighbourhood: 'valid_neighbourhood',
          number: 'valid_number',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('city');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if state is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          zipcode: 'valid_zipcode',
          neighbourhood: 'valid_neighbourhood',
          number: 'valid_number',
          city: 'valid_city',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('state');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if country is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          name: 'valid_name',
          type: 'valid_type',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          zipcode: 'valid_zipcode',
          neighbourhood: 'valid_neighbourhood',
          number: 'valid_number',
          state: 'valid_state',
          city: 'valid_city',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('country');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if maxBookingHour is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('maxBookingHour');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should throw exception if minBookingHour is not provided', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const expectedException = new MissingParamException('minBookingHour');

    await expect(() => sut.handle(requestBody)).rejects.toStrictEqual(expectedException);
  });

  test('Should call RegisterEstablishmentService exec method with correct provided params', async () => {
    const { sut, registerEstablishmentServiceStub } = sutFactory;

    const spySut = vi.spyOn(registerEstablishmentServiceStub, 'exec');

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    await sut.handle(requestBody);

    expect(spySut).toHaveBeenCalledOnce();
    expect(spySut).toHaveBeenCalledWith({
      userId: requestBody.body.userId,
      establishment: requestBody.body.establishment,
    });
  });

  test('Should return 201 if nothing goes wrong', async () => {
    const { sut } = sutFactory;

    const requestBody = {
      body: {
        userId: 'valid_id',
        establishment: {
          type: 'valid_type',
          name: 'valid_name',
          description: 'valid_description',
          contact: 'valid_contact',
          street: 'valid_street',
          neighbourhood: 'valid_neighbourhood',
          zipcode: 'valid_zipcode',
          number: 'valid_number',
          city: 'valid_city',
          state: 'valid_state',
          country: 'valid_country',
          complement: 'valid_complement',
          maxBookingHour: 'valid_booking_hour',
          minBookingHour: 'valid_booking_hour',
          images: [],
          commodities: [],
        },
      },
    };

    const response = await sut.handle(requestBody);

    expect(response).toEqual({
      status: 201,
      data: 'New establishment registered successfully.',
    });
  });
});
