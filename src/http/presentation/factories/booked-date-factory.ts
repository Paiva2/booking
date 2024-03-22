import { UserModel } from '../../data/db';
import { BookedDateModel } from '../../data/db/booked-date-model';
import { EstablishmentAttatchmentModel } from '../../data/db/establishment-attatchment-model';
import { NewBookDateService } from '../../domain/services/booked-dates/new-book-date-service';
import { NewBookDateController } from '../controllers/new-book-date/new-book-date-controller';
import { JwtHandlerAdapter } from '../utils/jwt-adapter';

export class BookedDateFactory {
  public async handle() {
    const { jwtHandler } = this.presentationProtocols();
    const { newBookDateService } = await this.services();

    const newBookDateController = new NewBookDateController(jwtHandler, newBookDateService);

    return {
      newBookDateController,
    };
  }

  private async services() {
    const {
      userModel,
      bookedDateModel,
      establishmentAttatchmentModel,
    } = this.models();

    const newBookDateService = new NewBookDateService(
      bookedDateModel,
      userModel,
      establishmentAttatchmentModel,
    );

    return {
      newBookDateService,
    };
  }

  private models() {
    const userModel = new UserModel();
    const bookedDateModel = new BookedDateModel();
    const establishmentAttatchmentModel = new EstablishmentAttatchmentModel();

    return {
      userModel,
      bookedDateModel,
      establishmentAttatchmentModel,
    };
  }

  private presentationProtocols() {
    const jwtHandler = new JwtHandlerAdapter();

    return {
      jwtHandler,
    };
  }
}
