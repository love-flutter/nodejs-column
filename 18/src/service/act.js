const Service = require('../core/service');
const load = require('../core/load');

const ACT_LIST_CACHE_KEY = 'activity_list_page_{page}';
const ACT_DETAIL_CACHE_KEY = 'activity_info_id_{actId}';
const CACHE_TIME_SEC = 120;

const cache = load.loadLib('cache');

class ActService extends Service {
    async getList(page=0) {
        page = parseInt(page);
        let actList = await cache.get(ACT_LIST_CACHE_KEY.replace('{page}', page));
        if(actList){
            return actList;
        }
        const actModel = load.loadModel(this.ctx, 'act');
        actList = await actModel.getOnlinList(page);
        if(!actList){
            return [];
        }
        cache.set(ACT_LIST_CACHE_KEY.replace('{page}', page), actList, CACHE_TIME_SEC).then();

        return actList;
    }

    async getDetail(id) {
        if(!id){
            return false;
        }
        let actInfo = await cache.get(ACT_DETAIL_CACHE_KEY.replace('{actId}', id));
        if(actInfo){
            return actInfo;
        }
        const actModel = load.loadModel(this.ctx, 'act');
        actInfo = await actModel.getOneById(id);

        if(actInfo) {
            this.cacheDetail(actInfo).then();
        }
        return actInfo;
    }

    async checkCanJoin(actId) {
        if(!actId){
            return -1; // 错误参数
        }
        const actInfo = await this.getDetail(actId);
        if(!actInfo){
            this.log('error', 'wrong act id', {actId});
            return -1; // 错误参数
        }

        const codeService = load.loadService(this.ctx, 'code');
        return await codeService.getUserJoinCode(actId);
    }

    async cacheList(cacheSize = 5) {
        const actModel = load.loadModel(this.ctx, 'act');

        let allResult = true;

        cacheSize = parseInt(cacheSize);
        if(cacheSize < 0){
            return allResult;
        }
        for(let i=0; i<cacheSize; i++){ // 分页获取数据并缓存，由于是离线服务，可以不需要考虑性能问题
            let actList = await actModel.getOnlinList(i);
            if(!actList || actList.length < 1){
                return allResult; 
            }
            actList.forEach(async actInfo => {
                await this.cacheDetail(actInfo);
            });
            let ret = await cache.set(ACT_LIST_CACHE_KEY.replace('{page}', i), actList, CACHE_TIME_SEC);
            if(!ret){
                this.log('error', `cache act page ${i} list error`);
            }
            allResult = allResult && ret;
        }
        return allResult;
    }

    async cacheDetail(actInfo) {
        if(!actInfo){
            return;
        }
        let ret = await cache.set(ACT_DETAIL_CACHE_KEY.replace('{actId}', actInfo['_id']), actInfo, CACHE_TIME_SEC, true);
        if(!ret){
            this.log('error', `cache act info ${actInfo['_id']} list error`, actInfo);
        }
    }
}

module.exports = ActService;