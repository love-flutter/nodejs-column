const Controller = require('../core/controller');

class Content extends Controller {

    test() {
        return this.resApi(true, 'good');
    }

    log() {
        this.ctx.log.info('test', `good success ${Math.random()}`)
        return this.resApi(true, 'log success');
    }

}

module.exports = Content;