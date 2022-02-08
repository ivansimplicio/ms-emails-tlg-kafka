import express from 'express';
import mailer from './services/nodemailer/mailer';

const app = express();

app.get('/send', (request, response) => {
  mailer.sendEmail({
    template: 'welcome',
    content: {
      user: { name: 'Ivan', email: 'ivan@email.com' },
      subject: 'TGL: Seja Bem Vindo',
    },
  });
  response.send('Email enviado!');
});

app.listen(process.env.PORT, () => {
  console.log(`App is running`);
});
