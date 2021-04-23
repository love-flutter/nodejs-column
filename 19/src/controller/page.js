const Controller = require('../core/controller');

class Page extends Controller {
    async index() {
        let name = this.getParams('name');
        return this.resApi(true, 'success', {name} );
    }

}

module.exports = Page;