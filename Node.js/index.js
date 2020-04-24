const http = require('http');
const nodemailer = require('nodemailer');
const port = 3000;

const transporter = nodemailer.createTransport({
  host: 'mail',
  port: 25,
  ignoreTLS: true
});

const server = http.createServer((request, response) => {
  console.log(request.url)
  switch (request.url) {
    case '/mail':
      transporter.sendMail({
        from: 'mail@localhost',
        to: 'mail@localhost',
        subject: 'Sent from Nodemailer',
        text: 'Sent from Nodemailer'
      })
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end('Sent mail. Check <a href="http://localhost:1080/">localhost:1080</a>')
      break;

    default:
      response.end('Hello world!')
      break;
  }
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});