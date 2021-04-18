const querystring = require('querystring');
const Controller = require('../core/controller');
const load = require('../core/load');

class Act extends Controller {

    async list() {
        let page = parseInt(this.getParams('page'));
        if(!page || page < 0) {
            page = 0;
        } 
        const actService = load.loadService(this.ctx, 'act');
        const actList = await actService.getList(page);

        if(!actList || actList.length < 1) {
            return this.resApi(true, 'success', []);
        }
        return this.resApi(true, 'success', actList);
    }

    async detail() {
        const id = this.getParams('id');
        if(!id) {
            return this.resApi(false, 'id is empty'); 
        }
        const actService = load.loadService(this.ctx, 'act');
        const actInfo = await actService.getDetail(id);
        if(!actInfo) {
            return this.resApi(true, 'success', {});
        }
        return this.resApi(true, 'success', actInfo);
    }

    async setCache() {
        const actService = load.loadService(this.ctx, 'act');
        const ret = await actService.cacheList();
        if(ret){
            this.resApi(true, 'success', 'cache all list and detail success');
        } else {
            this.resApi(false, 'failed', 'cache all list and detail failed');
        }
    }

}

module.exports = Act;