class Service {
    constructor(ctx) {
        this.ctx = ctx;
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

module.exports = Service;