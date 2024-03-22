import { Express, Request, Response } from 'express';
import { BookedDateFactory } from '../factories/booked-date-factory';

const prefix = '/api/v1/booking';

const bookdateFactory = new BookedDateFactory();

export function bookDateRoutes(app: Express) {
  app.post(`${prefix}/new`, async (req: Request, res: Response) => {
    const { newBookDateController } = await bookdateFactory.handle();

    const newBookingDate = await newBookDateController.handle(req);

    return res.status(newBookingDate.status).send(newBookingDate.data);
  });
}
