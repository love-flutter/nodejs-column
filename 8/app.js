const Koa = require('koa');
const app = new Koa();
const routerMiddleware = require('./src/middleware/router');
const logCenter = require('./src/middleware/logCenter');

app.use(logCenter());
app.use(routerMiddleware());

app.listen(3000, () => console.log(`Example app listening on port 3000!`));