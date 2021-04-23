const baseFun = require('../lib/baseFun');

const whiteList = [
    '127.0.0.1:3000'
];

module.exports = function () {
    return async function ( ctx, next ) {
       if(ctx.request.headers.referer && !whiteList.includes(ctx.request.headers.referer)){
            baseFun.setResInfo(ctx, false, 'access have been forbidden', null, 403);
            return;
       }
       return await next();
    }
}