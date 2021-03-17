const Log = require('../lib/log');

const log = new Log();

log.start();

module.exports = function () {
    return async function ( ctx, next ) {
       ctx.log = log;
       await next();
    }
}