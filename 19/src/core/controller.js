const querystring = require('querystring');
const baseFun = require('../lib/baseFun');

class Controller {
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param {string} key 
     * @param {any} def 
     */
    getParams(key, def='') {
        const params = querystring.parse(this.ctx.request.querystring);
        let value = params[key];
        if(!value) {
            return def;
        }
        return decodeURI(value).trim();
    }

    /**
     * 
     * @description 设置响应数据
     * @param object res http res
     * @param boolean ret boolean
     * @param string message string
     * @param object dataInfo object
     * @param int httpStatus
     */
    resApi(ret, message, dataInfo, httpStatus=200) {
        httpStatus = parseInt(httpStatus);
        if(!httpStatus || httpStatus == 0){
            httpStatus = 200;
        }
        return baseFun.setResInfo(this.ctx, ret, message, dataInfo, httpStatus);
    }

    /**
     * 
     * @param {string} logType 日志类型 info | error | warning | debug
     * @param {string} message 消息
     * @param {object} logInfo 日志信息
     */
    log(logType, message, logInfo) {
        return this.ctx.log.add(logType, this.ctx.pathname, message, logInfo);
    }
}

module.exports = Controller;