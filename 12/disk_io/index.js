const http = require('http');
const fs = require('fs');
// 引入 v8-profiler 库，可以作为一个中间件来实现
const v8Profiler = require('./lib/v8_profiler');
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    let ret = fs.readFileSync('./test_file.conf');
    res.write(ret);
    res.end();
});
/**
 * 
 * 启动服务，并开始执行 v8 profiler 的采集工作
 */
server.listen(3000, () => {
    console.log('server start http://127.0.0.1:3000');
    v8Profiler.start();
});