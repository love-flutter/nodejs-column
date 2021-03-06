const http = require('http');
// 引入 v8-profiler 库，可以作为一个中间件来实现
const v8Profiler = require('./lib/v8_profiler');
// 引入 api 库
const callApi = require('./lib/call_api');

/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    callApi('http://127.0.0.1:4000', (ret) => { // 调用 4000 服务，并显示返回结果
        if(ret) {
            res.write(ret);
        } else {
            res.write('call api server error');
        }
        res.end();
    });
});
/**
 * 
 * 启动服务，并开始执行 v8 profiler 的采集工作
 */
server.listen(3000, () => {
    console.log('server start http://127.0.0.1:3000');
    v8Profiler.start();
});