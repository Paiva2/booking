import z from 'zod';

const hourRegex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/;

export const registerEstablishmentDTO = z.object({
  type: z.enum(
    ['hotel', 'house', 'kitnet', 'apartment'],
    { description: 'Invalid establishment type.' },
  ),

  name: z.string({
    required_error: "name can't be empty.",
    invalid_type_error: 'name must be an string.',
  }),

  description: z.string({
    required_error: "description can't be empty.",
    invalid_type_error: 'description must be an string.',
  }),

  contact: z.string({
    required_error: "contact can't be empty.",
    invalid_type_error: 'contact must be an string.',
  }),

  street: z.string({
    required_error: "street can't be empty.",
    invalid_type_error: 'street must be an string.',
  }),

  neighbourhood: z.string({
    required_error: "neighbourhood can't be empty.",
    invalid_type_error: 'neighbourhood must be an string.',
  }),

  zipcode: z.string({
    required_error: "zipcode can't be empty.",
    invalid_type_error: 'zipcode must be an string.',
  }),

  maxBookingHour: z.string({
    required_error: "maxBookingHour can't be empty.",
    invalid_type_error: 'maxBookingHour must be an string.',
  }).regex(hourRegex, { message: 'maxBookingHour invalid format. Ex: 22:00' }),

  minBookingHour: z.string({
    required_error: "minBookingHour can't be empty.",
    invalid_type_error: 'minBookingHour must be an string.',
  }).regex(hourRegex, { message: 'minBookingHour invalid format. Ex: 12:00' }),

  number: z.string({
    required_error: "number can't be empty.",
    invalid_type_error: 'number must be an string.',
  }),

  city: z.string({
    required_error: "city can't be empty.",
    invalid_type_error: 'city must be an string.',
  }),

  state: z.string({
    required_error: "state can't be empty.",
    invalid_type_error: 'state must be an string.',
  }),

  country: z.string({
    required_error: "country can't be empty.",
    invalid_type_error: 'country must be an string.',
  }),

  complement: z.string({
    required_error: "complement can't be empty.",
    invalid_type_error: 'complement must be an string.',
  }).optional(),

  images: z.array(z.string()).nonempty({ message: "images can't be empty." }),

  commodities: z.array(
    z.object({
      name: z.string(),
      iconUrl: z.string().optional(),
    }),
  ).optional(),
});
