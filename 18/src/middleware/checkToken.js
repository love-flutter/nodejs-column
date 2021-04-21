const querystring = require('querystring');

const baseFun = require('../lib/baseFun');

const tokenMapping = {
    'piu12naern9023izcx' : '1001',
    'dopu89y762yimb239x' : '1002'
};

module.exports = function () {
    return async function ( ctx, next ) {
        const params = querystring.parse(ctx.request.querystring);
        let token = ctx.request.headers.token || params['token'];
        if(!token && !tokenMapping[token]){
            return baseFun.setResInfo(ctx, false, 'pls login first', null, 401); 
        }    
       ctx.userId = tokenMapping[token];
       //ctx.userId = `${ Math.floor(Math.random() * (10000000 - 1000) + 1000)}`;
        await next();
    }
}
