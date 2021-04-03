const querystring = require('querystring');
const Controller = require('../../core/controller');

class Eval extends Controller {

    index() {
        const params = querystring.parse(this.ctx.request.querystring);
        // 获取参数 r
        let r = decodeURI(params['r']);
        // 根据参数 r 动态调用 this._p() 获取执行结果
        let ret = eval(`this._q() + ${r}`);

        return this.resApi(true, 'good', ret);
    }

    _q () {
        return 1;
    }

    _p () {
        return 2;
    }

}

module.exports = Eval;