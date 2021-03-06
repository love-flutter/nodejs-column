const http = require('http');
// 引入 v8-profiler 库，可以作为一个中间件来实现
const v8Profiler = require('./lib/v8_profiler');
// 引入 md5 库
const getMd5 = require('./lib/md5');
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    // 设置返回的字符串
    let ret;
    // 加密一组数据
    const md5List = ['hello', 'Node.js', 'lagou', 'is', 'great'];
    md5List.forEach( (str)=> {
        if(ret){
            ret = `${ret} ${getMd5(str)}`;
        } else {
            ret = getMd5(str)
        }
    });
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