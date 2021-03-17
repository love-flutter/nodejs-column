const http = require('http');
const URL = require('url').URL;

const baseFun = require('./util/baseFun');

const routerMapping = {
    '/v1/cpu' : {
        'controller' : 'test',
        'method' : 'bad'
    },
    '/v1/normal' : {
        'controller' : 'test',
        'method' : 'normal'
    },
    '/v1/normal-call' : {
        'controller' : 'test',
        'method' : 'normalCall'
    }
};
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer(async (req, res) => {
    // 获取 get 参数
    const myUrl = new URL(req.url, `http://${req.headers.host}`); 
    const pathname = myUrl.pathname;
    
    // 过滤非拉取用户信息请求
    if(!routerMapping[pathname]) {
      return baseFun.setResInfo(res, false, 'path not found', null, 404);
    }
    // require 对应的 controller 类
    const ControllerClass = require(`./controller/${routerMapping[pathname]['controller']}`);

    try { // 尝试调用类中的方法
        const controllerObj = new ControllerClass(res, req);
        if(controllerObj[
            routerMapping[pathname]['method']
        ][
            Symbol.toStringTag
        ] === 'AsyncFunction') { // 判断是否为异步 promise 方法，如果是则使用 await
            return await controllerObj[routerMapping[pathname]['method']]();
        } else { // 普通方法则直接调用
            return controllerObj[routerMapping[pathname]['method']]();
        }
    } catch (error) { // 异常时，需要返回 500 错误码给前端
        console.log(error);
        return baseFun.setResInfo(res, false, 'server error', null, 500);
    }
});

/**
 * 
 * 启动服务
 */
server.listen(4000, () => {
    console.log('server start http://127.0.0.1:4000');
});


