const http = require('http');
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    let sum = 0;
    for(let i=500000000; i<1000000000; i++){
        sum = sum + i;
    }
    res.write(`${sum}`);
    res.end();
});

/**
 * 
 * 启动服务
 */
server.listen(6000, () => {
    console.log('server start http://127.0.0.1:6000');
});