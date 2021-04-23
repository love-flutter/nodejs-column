const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
//const checkToken = require('./src/middleware/checkToken');
const routerMiddleware = require('./src/middleware/router');
//const backendRouter = require('./src/middleware/backendRouter');
const logCenter = require('./src/middleware/logCenter');
const security = require('./src/middleware/security');

app.use(logCenter());
app.use(security());
//app.use(checkToken());
app.use(koaBody({
    multipart: true
}));
app.use(routerMiddleware());
//app.use(backendRouter());

//app.listen(3000, () => console.log(`Example app listening on port 3000!`));