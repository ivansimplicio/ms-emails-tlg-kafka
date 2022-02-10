import { Kafka } from 'kafkajs';
import mailer from './services/nodemailer/mailer';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'ms-emails-consumer',
  brokers: ['kafka:29092'],
});

const consumer = kafka.consumer({ groupId: 'ms-emails' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'welcome', fromBeginning: false });
  await consumer.subscribe({ topic: 'forgot_password', fromBeginning: false });
  await consumer.subscribe({ topic: 'new_bet', fromBeginning: false });
  await consumer.subscribe({ topic: 'call_players', fromBeginning: false });
  await consumer.subscribe({ topic: 'notify_admin', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      mailer.sendEmail({
        template: topic.toString(),
        content: message.value?.toString(),
      });
    },
  });
};
run().catch(console.error);

const port = process.env.PORT || 3636;

app.listen(port, () => {
  console.log(`the application is running on port ${port}`);
});
