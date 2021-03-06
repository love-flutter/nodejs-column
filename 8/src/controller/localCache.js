const Controller = require('../core/controller');

let result = 0;
class LocalCache extends Controller {

    yes() {
        if(result == 0){ // result 为函数本地内存缓存
            for(let i=0; i<1000000000; i++){
                result = result + i;
            }
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