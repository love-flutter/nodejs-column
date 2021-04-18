const baseMongo = require('../core/baseMongodb')();

class Model {
    constructor() {
        this.db = 'nodejs_cloumn';
        this.baseMongo = baseMongo;
    }

    async get(collectionName) {
        const client = await this.baseMongo.getClient();
        const collection = client.db(this.db).collection(collectionName);
        return collection;
    }

    /**
     * 
     * @param {string} logType 日志类型 info | error | warning | debug
     * @param {object} logInfo 日志信息
     */
    log(logType, logInfo) {
        return this.ctx.log.add(logType, this.ctx.pathname, logInfo);
    }
}

module.exports = Model;