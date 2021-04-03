const NodeCache = require( "node-cache");
const cacheHandle = new NodeCache();

const Controller = require('../core/controller');

class LocalCache extends Controller {

    yes() {
        let result = cacheHandle.get('result');
        if(!result || result == 0){ // result 为函数本地内存缓存
            result = 0;
            for(let i=0; i<1000000000; i++){
                result = result + i;
            }
            cacheHandle.set('result', result)
        }
        return this.resApi(true, 'success', `cache sum 0 - 1000000000 is ${result}`);
    }

    no() { 
        let sum = 0;
        for(let i=0; i<1000000000; i++){
            sum = sum + i;
        }
        return this.resApi(true, 'success', `no cache sum 0 - 1000000000 is ${sum}`);
    }
}

module.exports = LocalCache;