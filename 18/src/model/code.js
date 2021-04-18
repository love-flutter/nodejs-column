const { promisify } = require("util");
const ObjectID = require('mongodb').ObjectID;

const Model = require('../core/model');
const load = require('../core/load');

const cache = load.loadLib('cache');

const ACT_TICKET_CODES = 'activity_ticket_codes_{actId}';

class CodeModel extends Model {
    constructor(ctx) {
        super(ctx);
        this.collectionName = 'ticket_code';
    }

    async lpushCodes(actId, codes) {
        let redisClient = cache.getRedis();
        let key = ACT_TICKET_CODES.replace('{actId}', actId);

        let successList = [];
        for(const ticketCode of codes){
            const lremRet = await promisify(redisClient.lrem).bind(redisClient)(key, 0, ticketCode);
            const lpushRet = await promisify(redisClient.lpush).bind(redisClient)(key, ticketCode);
            if(lremRet == 0 && lpushRet){
                successList.push(ticketCode);
            }
        }
       
        return successList;
    }

    async lpopCode(actId) {
        let redisClient = cache.getRedis();
        let key = ACT_TICKET_CODES.replace('{actId}', actId);
        const ret = await promisify(redisClient.lpop).bind(redisClient)(key);
        return ret;
    }

    async getInfoByCode(ticketCode) {
        if(!ticketCode){
            return false;
        }
        const collection = await this.get();
        const queryOption = {
            'code' : ticketCode
        };
        const queryArr = await collection.find(queryOption).toArray();
        if(!queryArr || queryArr.length < 1){
            return false;
        }
        const rowInfo = queryArr.pop();
        rowInfo['_id'] = rowInfo['_id'].toString();
        
        return rowInfo;
    }

    async getInfoByCodeAndTicket(ticketCode, ticketId) {
        if(!ticketCode){
            return false;
        }
        const collection = await this.get();
        const queryOption = {
            'code' : ticketCode,
            'ticket_id' : ticketId
        };
        const queryArr = await collection.find(queryOption).toArray();
        if(!queryArr || queryArr.length < 1){
            return false;
        }
        const rowInfo = queryArr.pop();
        rowInfo['_id'] = rowInfo['_id'].toString();
        
        return rowInfo;
    }

    async queryTickIds(ids = []){
        let retInfo = {};
        if(!ids || ids.length < 1){
            return false;
        }
        const objectIds = [];
        ids.forEach(id => {
            objectIds.push(
                new ObjectID(id)
            );
        });
        const collection = await this.get();
        const queryOption = {
            '_id' : {
                '$in' : objectIds
            }
        };
        const queryArr = await collection.find(queryOption).toArray();
        if(!queryArr || queryArr.length < 1){
            return false;
        }
        queryArr.forEach(codeInfo => {
            if(!codeInfo['ticket_id'] || !codeInfo['code']){
                return;
            }
            retInfo[codeInfo['_id']] = {
                'ticket_id' : codeInfo['ticket_id'],
                'code' : codeInfo['code'],
            };
        });
        return retInfo;
    }

}

module.exports = CodeModel;