const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
/**
 * 中间件 1
 */
app.use(async (req, res, next) => {
    console.log('first');
    await next();
    console.log('first end');
});
/**
 * 中间件 2
 */
app.use(async (req, res, next) => {
    console.log('second');
    await next();
    console.log('second end');
});

/**
 * 异步中间件
 */
app.use(async (req, res, next) => {
    console.log('async');
    await next();
    await new Promise(
        (resolve) => 
            setTimeout(
                () => {
                    console.log(`wait ${s} ms end`);
            resolve()
        }, 
      1000)
    );
    console.log('async end');
});

/**
 * 中间件 3
 */
app.use(async (req, res, next) => {
    console.log('third');
    await next();
    console.log('third end');
});

app.get('/', (req, res) => res.send('Hello World!'))

