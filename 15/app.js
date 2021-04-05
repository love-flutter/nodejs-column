const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const routerMiddleware = require('./src/middleware/router');
const logCenter = require('./src/middleware/logCenter');
const security = require('./src/middleware/security');
const session = require('./src/middleware/session');

app.use(logCenter());
app.use(session());
app.use(security());
app.use(koaBody({
    multipart: true
}));
app.use(routerMiddleware());

app.listen(3002, () => console.log(`Example app listening on port 3002!`));