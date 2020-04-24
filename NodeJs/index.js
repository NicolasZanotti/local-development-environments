const http = require('http');
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  host: 'mail',
  port: 25,
  ignoreTLS: true
});

const client = new Client({
  host: 'db',
  database: 'test',
  user: 'postgres',
  password: 'password',
  port: 5432,
})

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
      response.end('Sent mail. Check <a href="http://localhost:3001/">localhost:3001</a>.');
      break;

    case '/company/create':
      result = await client.query(`CREATE TABLE company (
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

server.listen(port, (error) => {
  if (error) return console.error(error.message);
  console.log(`server listening on port ${port}`);
});

(async function run() {
  await client.connect();
  const res = await client.query('SELECT * from company');
  console.log(res.rows);
  
  await client.end();
})();