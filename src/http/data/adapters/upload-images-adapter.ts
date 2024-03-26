import { s3 } from '../../../config/aws';
import { ImageHandler } from '../../domain/protocols';

export class UploadImagesAdapter implements ImageHandler {
  private imagesDestination = process.env.AWS_S3_ESTABLISHMENTS_BUCKET_NAME as string;

  public async upload(params: {
    fileName: string;
    fileBuffer: Buffer;
    mimeType: string;
  }): Promise<{ url: string; }> {
    const getFileType = params.mimeType.split('/')[1];

    const makeFileName = `
      ${params.fileName.replaceAll('.jpeg', '').replaceAll('.jpg', '').replaceAll('.png', '')}
      _${new Date().getTime()}.${getFileType}
    `;

    const awsParams = {
      Bucket: this.imagesDestination,
      Key: makeFileName,
      Body: params.fileBuffer,
      ContentType: params.mimeType,
    };

    let urlParam = '';

    try {
      const uploadResponse = await s3.upload(awsParams).promise();

      urlParam = uploadResponse.Location;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }

    return { url: urlParam };
  }
}
