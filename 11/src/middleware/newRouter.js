const URL = require('url').URL;

const baseFun = require('../lib/baseFun');

module.exports = function () {
    return async function ( ctx, next ) {
        // 获取 get 参数
        const myUrl = new URL(ctx.request.url, `http://${ctx.request.headers.host}`); 
        let pathname = myUrl.pathname;
        
        // 去除非常规请求路径，将-转化为大写
        pathname = pathname.replace('..', '').replace(/\-(\w)/g, (all,letter)=>letter.toUpperCase());

        pathnameArr = pathname.split('/');
        pathnameArr.shift();
        
        if(pathnameArr.length < 2){
            baseFun.setResInfo(ctx, false, 'path not found', null, 404);
            return await next();
        }
        let method = pathnameArr.pop();
        if(!method){
            baseFun.setResInfo(ctx, false, 'path not found', null, 404);
            return await next();
        }

        let controllerPath = pathnameArr.join('/');
        
        let ControllerClass;
        try {
            ControllerClass = require(`../controller/${controllerPath}`);
        } catch(err){
            console.log(pathname, controllerPath, err);
            baseFun.setResInfo(ctx, false, 'path not found', null, 404);
            return await next();
        }

        try { // 尝试调用类中的方法
            // require 对应的 controller 类
            const controllerObj = new ControllerClass(ctx);

            if(!controllerObj[method]){
                baseFun.setResInfo(ctx, false, 'path not found', null, 404);
                return await next();
            }
            if(controllerObj[
                method
            ][
                Symbol.toStringTag
            ] === 'AsyncFunction') { // 判断是否为异步 promise 方法，如果是则使用 await
                await controllerObj[method]();
                return await next();
            } else { // 普通方法则直接调用
                return controllerObj[method]();
            }
        } catch (error) { // 异常时，需要返回 500 错误码给前端
            console.log(error);
            baseFun.setResInfo(ctx, false, 'server error', null, 500);
            return await next();
        }
    }
}