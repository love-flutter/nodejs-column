const Model = require('../core/model');

class TicketModel extends Model {
    constructor(ctx) {
        super(ctx);
        this.collectionName = 'ticket';
    }

}

module.exports = TicketModel;