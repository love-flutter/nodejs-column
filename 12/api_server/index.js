const http = require('http');
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    setTimeout(() => { // 延迟 1 秒返回
        res.write('this is api result');
        res.end();
    }, 1 * 1000);
});
/**
 * 
 * 启动服务，并开始执行 v8 profiler 的采集工作
 */
server.listen(4000, () => {
    console.log('server start http://127.0.0.1:4000');
});