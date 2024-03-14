import z from 'zod';

export const registerUserDTO = z.object({
  name: z.string({
    required_error: "name can't be empty.",
    invalid_type_error: 'name must be an string.',
  }),
  email: z.string({
    required_error: "email can't be empty.",
    invalid_type_error: 'email must be an string.',
  }).email({ message: 'email param must be an valid e-mail.' }),
  password: z.string({
    required_error: "password can't be empty.",
    invalid_type_error: 'password must be an string.',
  }).min(6, { message: 'password must have at least 6 characters.' }),
  contact: z.string({
    required_error: "contact can't be empty.",
    invalid_type_error: 'contact must be an string.',
  }),
  address: z.object({
    street: z.string({
      required_error: "street can't be empty.",
      invalid_type_error: 'street must be an string.',
    }),
    zipcode: z.string({
      required_error: "zipcode can't be empty.",
      invalid_type_error: 'zipcode must be an string.',
    }),
    neighbourhood: z.string({
      required_error: "neighbourhood can't be empty.",
      invalid_type_error: 'neighbourhood must be an string.',
    }),
    number: z.string({
      required_error: "number can't be empty.",
      invalid_type_error: 'number must be an string.',
    }),
    complement: z.string({
      required_error: "complement can't be empty.",
      invalid_type_error: 'complement must be an string.',
    }).optional(),
    state: z.string({
      required_error: "state can't be empty.",
      invalid_type_error: 'state must be an string.',
    }),
    city: z.string({
      required_error: "city can't be empty.",
      invalid_type_error: 'city must be an string.',
    }),
  }),
});

export const authUserDTO = z.object({
  email: z.string({
    required_error: "email can't be empty.",
    invalid_type_error: 'email must be an string.',
  }).email({ message: 'email param must be an valid e-mail.' }),
  password: z.string({
    required_error: "password can't be empty.",
    invalid_type_error: 'password must be an string.',
  }).min(6, { message: 'password must have at least 6 characters.' }),
});

export const updateUserDTO = z.object({
  name: z.string({
    required_error: "name can't be empty.",
    invalid_type_error: 'name must be an string.',
  }).optional(),

  email: z.string({
    required_error: "email can't be empty.",
    invalid_type_error: 'email must be an string.',
  }).email({ message: 'email param must be an valid e-mail.' }).optional(),

  password: z.string({
    required_error: "password can't be empty.",
    invalid_type_error: 'password must be an string.',
  }).min(6, { message: 'password must have at least 6 characters.' }).optional(),

  contact: z.string({
    required_error: "contact can't be empty.",
    invalid_type_error: 'contact must be an string.',
  }).optional(),

  street: z.string({
    required_error: "street can't be empty.",
    invalid_type_error: 'street must be an string.',
  }).optional(),

  zipcode: z.string({
    required_error: "zipcode can't be empty.",
    invalid_type_error: 'zipcode must be an string.',
  }).optional(),

  neighbourhood: z.string({
    required_error: "neighbourhood can't be empty.",
    invalid_type_error: 'neighbourhood must be an string.',
  }).optional(),

  number: z.string({
    required_error: "number can't be empty.",
    invalid_type_error: 'number must be an string.',
  }).optional(),

  complement: z.string({
    required_error: "complement can't be empty.",
    invalid_type_error: 'complement must be an string.',
  }).optional(),

  state: z.string({
    required_error: "state can't be empty.",
    invalid_type_error: 'state must be an string.',
  }).optional(),

  city: z.string({
    required_error: "city can't be empty.",
    invalid_type_error: 'city must be an string.',
  }).optional(),
});

export const forgotUserPasswordDTO = z.object({
  email: z.string({
    required_error: "email can't be empty.",
    invalid_type_error: 'email must be an string.',
  }).email({ message: 'email param must be an valid e-mail.' }),
});
