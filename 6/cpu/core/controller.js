const baseFun = require('../util/baseFun');

class Controller {
    constructor(res, req) {
        this.res = res;
        this.req = req;
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
        return baseFun.setResInfo(this.res, ret, message, dataInfo, httpStatus);
    }
}

module.exports = Controller;