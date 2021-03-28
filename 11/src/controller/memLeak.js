const Controller = require('../core/controller');

class MemLeak extends Controller {

    login() {
        for(let i=0; i<10000000; i++){
            this.ctx.session.set(i);
        }
        return this.resApi(true, 'set success');
    }
}

module.exports = MemLeak;