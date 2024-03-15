import { Queue } from 'bullmq';
import { redisConnection } from './redisConnection';

export default {
  mailQueue: new Queue('mailQueue', {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: { age: 86400 }, // 1 day,
      attempts: 2,
    },
  }),
};
