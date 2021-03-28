const Controller = require('../../core/controller');

class Test extends Controller {

    index() {
        return this.resApi(true, 'good');
    }

    indexTest() {
        return this.resApi(true, 'good 2');
    }

}

module.exports = Test;