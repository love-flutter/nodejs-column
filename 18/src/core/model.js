const baseMongo = require('../lib/baseMongodb')();
const ObjectID = require('mongodb').ObjectID;

class Model {
    constructor(ctx) {
        this.ctx = ctx;
        this.db = 'nodejs_cloumn';
        this.baseMongo = baseMongo;
        this.collectionName;
    }

    async get() {
        const client = await this.baseMongo.getClient();
        const collection = client.db(this.db).collection(this.collectionName);
        return collection;
    }

    async insertOne(rowInfo) {
        if(!rowInfo) {
            this.log('error', `insert one row in ${this.collection} error, params error`, rowInfo);
            return false;
        }
        const collection = await this.get();
        const result = await collection.insertOne(rowInfo);
        if(result){
            return result.insertedId.toString();
        }
        this.log('error', `insert one row in ${this.collection} error`, rowInfo);
        return false;
    }

    async insertMany(rowList) {
        if(!rowList || rowList.length < 1){
            return false;
        }
        const collection = await this.get();
        const result = await collection.insertMany(rowList);
        if(result && result.insertedCount == rowList.length){
            return true;
        }
        this.log('error', `insert some row error`, rowList);
        return false;
    }

    async getOneById(id) {
        if(!id || (id.length != 12 && id.length != 24)){
            this.log('error', 'id is not right', id);
            return false;
        }
        const collection = await this.get();
        const queryOption = {
            '_id' : new ObjectID(id)
        };
        const queryArr = await collection.find(queryOption).toArray();
        if(!queryArr || queryArr.length < 1){
            return false;
        }
        
        const rowInfo = queryArr.pop();
        rowInfo['_id'] = rowInfo['_id'].toString();
        
        return rowInfo;
    }

    async getList(queryOption={}, sort, limit=0, offset=0) {
        const collection = await this.get();
        let queryFun = collection.find(queryOption);

        if(sort){
            queryFun = queryFun.sort();
        }
        if(limit > 0){
            queryFun = queryFun.limit(limit);
        }
        if(offset > 0){
            queryFun = queryFun.skip(offset);
        }
        let queryArr = await queryFun.toArray();
        if(queryArr && queryArr.length > 0){
            queryArr = queryArr.map(rowInfo => {
                rowInfo['_id'] = rowInfo['_id'].toString();
                return rowInfo;
            });
        }
      
        return queryArr;
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

module.exports = Model;