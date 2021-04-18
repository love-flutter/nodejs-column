const moment = require('moment');

const Service = require('../core/service');
const load = require('../core/load');

class HistoryService extends Service {
   async insertHistory(actId, ticketCode) {
        const codeModel = load.loadModel(this.ctx, 'code');

        const codeInfo = await codeModel.getInfoByCode(ticketCode);
        if(!codeInfo) { // 该类告警比较严重，如果出现该问题，则应迅速排查，不过这时候票已经属于该用户，问题倒不是非常严重
            this.log('error', 'can not find code info, import code error', {actId, ticketCode})
        }
        const historyModel = load.loadModel(this.ctx, 'history');

        const rowInfo = {
            'user_id' : this.ctx.userId,
            'code_id' : codeInfo['_id'],
            'time' : moment().unix(),
            'is_effective' : true
        };

        const ret = await historyModel.insertOne(rowInfo);
        if(!ret){ // 此类告警同样重要，不过这时候票已经属于该用户，问题倒不是非常严重
            this.log('error', 'insert history error, user will not see his ticket code', {rowInfo});
            return false;
        }
        return true;
   }
}

module.exports = HistoryService;