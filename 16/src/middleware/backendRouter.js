const proxy = require('koa-better-http-proxy');
const nameService = require('../lib/nameService');

module.exports = function () {
    return function ( ctx, next ) {
        if(ctx.currentExist){
            return;
        }

        /// 转发相应的数据到指定服务，并且记录下系统日志
        const newService = nameService.get('poxyBackendServer');
        ctx.log.add('info', 'system', `current server do not find the ${ctx.pathname} path, forward the request to ${newService}`);
        
        return proxy(newService)(ctx, next);
    }
}