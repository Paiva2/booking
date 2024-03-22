import z from 'zod';

export const newBookDateDTO = z.object({
  establishmentAttatchmentId: z.string().uuid({ message: 'establishmentAttatchmentId must be an uuid.' }),
  bookedDate: z.coerce.date({ invalid_type_error: 'bookedDate must be an ISO8601 date format.' }),
});
