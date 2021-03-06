const Controller = require('../core/controller');

class Test extends Controller {

    constructor(res, req) {
        super(res, req);
    }
    /**
     * 复杂运算
     */
    bad() {
        let sum = 0;
        for(let i=0; i<10000000000; i++){
            sum = sum + i;
        }
        
        return this.resApi(true, 'success', {'sum' : sum});
    }

    /**
     * 正常请求
     */
    normal() {
        return this.resApi(true, 'good', 'hello world');
    }
}

module.exports = Test;