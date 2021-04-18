const Model = require('../core/model');

class HistoryModel extends Model {
    constructor(ctx) {
        super(ctx);
        this.collectionName = 'ticket_history';
    }

    async getMyTickList(page=0, pageSize=20) {
        const queryOption = {
            'user_id' : this.ctx.userId
        };
        return await this.getList(queryOption, {'start_time':-1, 'is_effective':1}, pageSize, page*pageSize);
    }

}

module.exports = HistoryModel;