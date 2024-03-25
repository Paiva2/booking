import { S3 } from 'aws-sdk';

export const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
