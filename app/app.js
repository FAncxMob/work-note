const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 80;
const BASE = '';
const serve = require('koa-static');
const config = require('./config.js');

function render(pagePath) {
  return new Promise((resolve, reject) => {
    // 生成二进制流
    fs.readFile(pagePath, 'binary', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

router.get(`${BASE}/config.js`, (ctx) => {
  ctx.body = `window.g_config = ${JSON.stringify(config)}`;
});

router.get('/(.*)', async (ctx) => {
  ctx.body = await render(path.join(__dirname, `../dist${BASE}`, 'index.html'));
});

app.use(serve(path.join(__dirname, `../dist`)));
app.use(router.routes());

app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});
