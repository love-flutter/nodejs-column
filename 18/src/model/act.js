const moment = require('moment');
const Model = require('../core/model');

class ActModel extends Model {
    constructor(ctx) {
        super(ctx);
        this.collectionName = 'act';
    }

    async getOnlinList(page=0, pageSize=20) {
        const currentTimestamp = moment().unix();
        const queryOption = {
            'start_time' : {
                '$lt' : currentTimestamp,
            },
            'end_time' : {
                '$gt' : currentTimestamp,   
            }
        };
        
        return await this.getList(queryOption, {'start_time':-1}, pageSize, page*pageSize);
    }

    async getOneByAid(aid) {
        if(!aid){
            return false;
        }
        const collection = await this.get();
        const queryOption = {
            'aid' : aid
        };
        const queryArr = await collection.find(queryOption).toArray();
        if(!queryArr || queryArr.length < 1){
            return false;
        }
        const rowInfo = queryArr.pop();
        rowInfo['_id'] = rowInfo['_id'].toString();
        
        return rowInfo;           
    }
}

module.exports = ActModel;