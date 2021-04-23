const Controller = require('../core/controller');

class Index extends Controller {
    async index() {
        return this.resApi(true, 'success', 'nodejs cloumn default system');
    }

}

module.exports = Index;