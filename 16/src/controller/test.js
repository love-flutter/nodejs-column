const Controller = require('../core/controller');

class Test extends Controller {

    index() {
        this.log('info', 'test');
        this.log('error', {'a':1, 'b':2});
        this.log('warning', 'warning');
        this.log('debug', 'warning');
        return this.resApi(true, 'good');
    }

    indexTest() {
        return this.resApi(true, 'good 2');
    }

}

module.exports = Test;