const Koa = require('koa');
const app = new Koa();
const routerMiddleware = require('./src/middleware/router');
//const routerMiddleware = require('./src/middleware/newRouter');
const logCenter = require('./src/middleware/logCenter');
const session = require('./src/middleware/session');

const dumpFun = require('./src/lib/heapdump'); 

app.use(logCenter());
app.use(session());
app.use(routerMiddleware());

app.listen(3000, () => console.log(`Example app listening on port 3000!`));

/// 为了方便，可以打开如下代码自动获取
const currentDate = new Date();
dumpFun('nodejs-cloumn', `${currentDate.getHours()}:${currentDate.getMinutes()+1}`, 60);