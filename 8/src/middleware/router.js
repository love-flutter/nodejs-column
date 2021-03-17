const URL = require('url').URL;

const baseFun = require('../lib/baseFun');

const routerMapping = {
    '/v1/contents' : {
        'controller' : 'content',
        'method' : 'list'
    },
    '/v1/test' : {
        'controller' : 'content',
        'method' : 'test'
    },
    '/v1/log' : {
        'controller' : 'content',
        'method' : 'log'
    },
    '/v1/cache' : {
        'controller' : 'localCache',
        'method' : 'yes'
    },
    '/v1/no-cache' : {
        'controller' : 'localCache',
        'method' : 'no'
    }
};

module.exports = function () {
    return async function ( ctx, next ) {
        // 获取 get 参数
        const myUrl = new URL(ctx.request.url, `http://${ctx.request.headers.host}`); 
        const pathname = myUrl.pathname;
        
        // 过滤非拉取用户信息请求
        if(!routerMapping[pathname]) {
            return baseFun.setResInfo(ctx, false, 'path not found', null, 404);
        }
        // require 对应的 controller 类
        const ControllerClass = require(`../controller/${routerMapping[pathname]['controller']}`);

        try { // 尝试调用类中的方法
            const controllerObj = new ControllerClass(ctx);
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
            return baseFun.setResInfo(ctx, false, 'server error', null, 500);
        }
        next();
    }
}