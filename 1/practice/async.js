const http = require('http');
const rp = require('request-promise');
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer((req, res) => {
    Promise.all([startCount(), nextCount()]).then((values) => {
        let sum = values.reduce(function(prev, curr, idx, arr){
            return parseInt(prev) + parseInt(curr);
        })
        res.write(`${sum}`);
        res.end(); 
    })
});

/**
 * 从 0 计算到 500000000 的和
 */
async function startCount() {
    return await rp.get('http://127.0.0.1:5000');
}

/**
 * 从 500000000 计算到 1000000000 之间的和
 */
async function nextCount() {
    return await rp.get('http://127.0.0.1:6000');
}

/**
 * 
 * 启动服务
 */
server.listen(4000, () => {
    console.log('server start http://127.0.0.1:4000');
});