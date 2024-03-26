import { UploadImagesAdapter } from '../../data/adapters/upload-images-adapter';
import { UploadImagesService } from '../../domain/services/upload-images-service/upload-images-service';
import { UploadImagesController } from '../controllers/upload-images/upload-images-controller';

export class GenericFactory {
  public async handle() {
    const { uploadImagesService } = await this.services();

    const uploadImagesController = new UploadImagesController(uploadImagesService);

    return {
      uploadImagesController,
    };
  }

  private async services() {
    const { imageHandlerAdapter } = this.domainProtocols();

    const uploadImagesService = new UploadImagesService(imageHandlerAdapter);

    return {
      uploadImagesService,
    };
  }

  private domainProtocols() {
    const imageHandlerAdapter = new UploadImagesAdapter();

    return {
      imageHandlerAdapter,
    };
  }
}
