import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Worker } from 'bullmq';
import { randomUUID } from 'crypto';
import { redisConnection } from './redisConnection';
import { mailTransporter } from './nodemailer';

const mailWorkerConfig = {
  connection: redisConnection,
  lockDuration: 60000, // 1 minute
};

export default {
  mailWorker: new Worker('mailQueue', async (job) => {
    const { to } = job.data;

    const jobToken = randomUUID();

    await mailTransporter.sendMail(
      job.data,
      async (err, info: SMTPTransport.SentMessageInfo) => {
        if (err) {
          console.error('Error while sending password mail...', to);

          await job.moveToFailed(new Error('Failed to send password mail'), jobToken, true);
        }

        console.log('Password mail sent successfully!', info.messageId);
      },
    );
  }, mailWorkerConfig),
};
