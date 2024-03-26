import { PutObjectCommand } from '@aws-sdk/client-s3';
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

    const makeFileName = `${params.fileName.replaceAll('.jpeg', '').replaceAll('.jpg', '').replaceAll('.png', '')}_${new Date().getTime()}.${getFileType}`;

    const awsParams = {
      Bucket: this.imagesDestination,
      Key: makeFileName,
      Body: params.fileBuffer,
      ContentType: params.mimeType,
    };

    let urlParam = '';

    try {
      await s3.send(new PutObjectCommand(awsParams));

      urlParam = `https://${this.imagesDestination}.s3.us-east-1.amazonaws.com/${makeFileName}`;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }

    return { url: urlParam };
  }
}
