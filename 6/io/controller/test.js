const rp = require('request-promise');

const Controller = require('../core/controller');

class Test extends Controller {

    constructor(res, req) {
        super(res, req);
    }
    /**
     * 复杂运算
     */
    async bad() {
        let result = await rp.get('http://127.0.0.1:3000/v1/cpu');

        let sumData = JSON.parse(result);
        let sum = sumData && sumData.data ? sumData.data.sum : false;
        return this.resApi(true, 'success', {'sum' : sum});
    }

    /**
     * 正常请求
     */
    normal() {
        return this.resApi(true, 'good', 'hello world io');
    }

    /**
     * 正常请求，api call 网络 I/O
     */
    async normalCall() {
        let result = await rp.get('http://127.0.0.1:5000/v1/normal');

        let dataInfo = JSON.parse(result);
        let info = dataInfo && dataInfo.data ? dataInfo.data : false;
        return this.resApi(true, 'success', info);
    }
}

module.exports = Test;