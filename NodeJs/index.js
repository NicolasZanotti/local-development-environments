const env = process.env;
const Koa = require('koa');
const Router = require('@koa/router');
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const app = new Koa();

app.context.transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  ignoreTLS: true
});

app.context.db = new Client({
  host: env.DB_HOST,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});
app.context.db.connect();

const router = new Router();
router.get('/', (ctx) => ctx.body = 'Hello world!');

router.get('/mail', (ctx) => {
  ctx.transporter.sendMail({
    from: 'mail@localhost',
    to: 'mail@localhost',
    subject: 'Sent from Nodemailer',
    text: `Sent from Nodemailer at server time ${(new Date).toISOString()}.`
  });
  ctx.type = 'text/html';
  ctx.body = `<html>Sent mail. <a href="http://localhost:${env.MAIL_ADMIN_PORT}">Check</a>.</html>`;
});

router.get('/insert', async (ctx) => {
  await ctx.db.query(`CREATE TABLE IF NOT EXISTS company (id serial PRIMARY KEY, name VARCHAR (50) UNIQUE NOT NULL)`);
  const result = await ctx.db.query('INSERT INTO company(name) VALUES($1) RETURNING *', ['Test Company ' + (new Date).toISOString()]);
  ctx.body = { status: 'success', data: result.rows };
});

router.get('/read', async (ctx) => {
  const result = await ctx.db.query('SELECT * from company');
  ctx.body = { status: 'success', data: result.rows };
});

app.use(router.routes());
app.listen(env.PORT);
console.log(`Node.js webapp running at 0.0.0.0:${env.PORT}`);
