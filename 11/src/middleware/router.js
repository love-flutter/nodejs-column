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
    },
    '/v1/local-cache' : {
        'controller' : 'cache',
        'method' : 'local'
    },
    '/v1/redis-cache' : {
        'controller' : 'cache',
        'method' : 'redis'
    },
    '/v1/both-cache' : {
        'controller' : 'cache',
        'method' : 'both'
    },
    '/v1/object-error' : {
        'controller' : 'error',
        'method' : 'obj'
    },
    '/v1/object-error-fix' : {
        'controller' : 'error',
        'method' : 'objFix'
    },
    '/v1/arr-object-error' : {
        'controller' : 'error',
        'method' : 'arrObj'
    },
    '/v1/arr-object-error-fix' : {
        'controller' : 'error',
        'method' : 'arrObjFix'
    },
    '/v1/arr-for' : {
        'controller' : 'error',
        'method' : 'forError'
    },
    '/v1/arr-for-fix' : {
        'controller' : 'error',
        'method' : 'forFix'
    },
    '/v1/json-parse' : {
        'controller' : 'error',
        'method' : 'jsonParse'
    },
    '/v1/jsingleton-test' : {
        'controller' : 'error',
        'method' : 'singletonTest'
    },
    '/v1/mem-leak' : {
        'controller' : 'memLeak',
        'method' : 'login'
    },
};

module.exports = function () {
    return async function ( ctx, next ) {
        // 获取 get 参数
        const myUrl = new URL(ctx.request.url, `http://${ctx.request.headers.host}`); 
        let pathname = myUrl.pathname;
        
        // 去除非常规请求路径
        pathname = pathname.replace('..', '');

        // 过滤非拉取用户信息请求
        if(!routerMapping[pathname]) {
            baseFun.setResInfo(ctx, false, 'path not found', null, 404);
            return await next();
        }

        try { // 尝试调用类中的方法
            // require 对应的 controller 类
            const ControllerClass = require(`../controller/${routerMapping[pathname]['controller']}`);
            const controllerObj = new ControllerClass(ctx);

            if(controllerObj[
                routerMapping[pathname]['method']
            ][
                Symbol.toStringTag
            ] === 'AsyncFunction') { // 判断是否为异步 promise 方法，如果是则使用 await
                await controllerObj[routerMapping[pathname]['method']]();
                return await next();
            } else { // 普通方法则直接调用
                return controllerObj[routerMapping[pathname]['method']]();
            }
        } catch (error) { // 异常时，需要返回 500 错误码给前端
            console.log(error);
            baseFun.setResInfo(ctx, false, 'server error', null, 500);
            return await next();
        }
    }
}