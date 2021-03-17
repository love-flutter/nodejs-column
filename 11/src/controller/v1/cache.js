const Controller = require('../core/controller');

const cache = require('../lib/cache')(true, false);
const redisCache = require('../lib/cache')(false, true);
const bothCache = require('../lib/cache')(true, true);

class LocalCache extends Controller {

    async local() {
        const cacheKey = 'sum_result';
        let result = await cache.get(cacheKey);
        if(!result){ // result 为函数本地内存缓存
            result = 0;
            for(let i=0; i<1000000000; i++){
                result = result + i;
            }
            cache.set(cacheKey, result, 10, true).then();
        }
        return this.resApi(true, 'success', `sum 0 - 1000000000 is ${result}`);
    }

    async redis(){
        const cacheKey = 'sum_result';
        let result = await redisCache.get(cacheKey);
        if(!result){ // result 为函数本地内存缓存
            result = 0;
            for(let i=0; i<1000000000; i++){
                result = result + i;
            }
            redisCache.set(cacheKey, result, 10).then();
        }
        return this.resApi(true, 'success', `sum 0 - 1000000000 is ${result}`);
    }

    async both() {
        const cacheKey = 'sum_result';
        let result = await bothCache.get(cacheKey);
        if(!result){ // result 为函数本地内存缓存
            result = 0;
            for(let i=0; i<1000000000; i++){
                result = result + i;
            }
            bothCache.set(cacheKey, result, 600, true).then();
        }
        //bothCache.set(cacheKey, result, 600, true).then();
        return this.resApi(true, 'success', `sum 0 - 1000000000 is ${result}`);
    }
}

module.exports = LocalCache;