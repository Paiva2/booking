import queues from './queues';
import workers from './workers';

export async function bullMq() {
  const { mailQueue } = queues;
  const { mailWorker } = workers;

  mailQueue.on('waiting', () => console.log('mailQueue is waiting for new jobs...'));

  mailWorker.on('completed', (job) => {
    console.log(`Job with ID ${job.id} has been completed.`);
  });

  mailWorker.on('failed', (job) => {
    console.log(`Job failed while processing: ${job?.id}`);
  });

  mailWorker.on('error', (job) => {
    console.log(`Job error while processing: ${job?.message}`);
  });
}
