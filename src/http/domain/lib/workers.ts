import { Worker } from 'bullmq';
import { randomUUID } from 'crypto';
import { redisConnection } from './redisConnection';
import { sendMail } from './nodemailer';

const mailWorkerConfig = {
  connection: redisConnection,
};

export default {
  mailWorker: new Worker('mailQueue', async (job) => {
    const jobToken = randomUUID();

    try {
      const successSend = await sendMail(job.data);

      console.log(`Mail send success ${successSend.messageId}`);
    } catch (e) {
      if (e instanceof Error) {
        await job.moveToFailed(new Error(e.message), jobToken, true);
      }
    }
  }, mailWorkerConfig),
};
