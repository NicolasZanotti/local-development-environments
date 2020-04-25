const http = require('http');
const nodemailer = require('nodemailer');
const { Client } = require('pg');

const env = process.env;

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  ignoreTLS: true
});

const client = new Client({
  host: env.DB_HOST,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

const server = http.createServer(async (request, response) => {
  let result;
  console.log(request.url);
  switch (request.url) {
    case '/mail':
      transporter.sendMail({
        from: 'mail@localhost',
        to: 'mail@localhost',
        subject: 'Sent from Nodemailer',
        text: 'Sent from Nodemailer'
      })
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(`Sent mail. <a href="http://localhost:${env.MAIL_ADMIN_PORT}">Check</a>.`);
      break;

    case '/company/create':
      result = await client.query(`CREATE TABLE IF NOT EXISTS company (
        id serial PRIMARY KEY,
        name VARCHAR (50) UNIQUE NOT NULL
      )`);
      response.end(JSON.stringify(result));
      break;

    case '/company/insert':
      result = await client.query('INSERT INTO company(name) VALUES($1) RETURNING *', ['Test Company']);
      response.end(JSON.stringify(result));
      break;

    case '/company':
      result = await client.query('SELECT * from company');
      response.end(JSON.stringify(result.rows));
      break;

    default:
      response.end("Hello world!");
      break;
  }
});

server.listen(env.PORT, (error) => {
  if (error) return console.error(error.message);
  console.log(`Node.js webapp running at 0.0.0.0:${env.PORT}`);
});
