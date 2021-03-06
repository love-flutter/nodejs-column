const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
/**
 * 中间件 1
 */
app.use((req, res, next) => {
    console.log('first');
    next();
    console.log('first end');
});
/**
 * 中间件 2
 */
app.use((req, res, next) => {
    console.log('second');
    next();
    console.log('second end');
});
/**
 * 中间件 3
 */
app.use((req, res, next) => {
    console.log('third');
    next();
    console.log('third end');
});

app.get('/', (req, res) => res.send('Hello World!'))

