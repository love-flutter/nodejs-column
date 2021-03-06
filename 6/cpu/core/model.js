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
}

module.exports = Model;