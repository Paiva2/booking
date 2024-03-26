import { S3 } from '@aws-sdk/client-s3';

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },

  region: 'us-east-1',
});
