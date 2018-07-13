const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Koa Hello World';
});

app.listen(8888);