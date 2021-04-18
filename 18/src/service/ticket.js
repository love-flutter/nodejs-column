const Service = require('../core/service');
const load = require('../core/load');

const cache = load.loadLib('cache');

const TICKET_DETAIL_CACHE_KEY = 'ticket_info_id_{ticketId}';
const CACHE_TIME_SEC = 0;

class TicketService extends Service {
    async getTicketByCode(ticketCode) {
        if(!ticketCode){
            return false;
        }
        const codeModel = load.loadModel(this.ctx, 'code');
        const codeInfo = await codeModel.getInfoByCode(ticketCode);

        if(!codeInfo || !codeInfo['ticket_id']){
            return;
        }

        let ticketInfo = await this.getTicketInfo(codeInfo['ticket_id']);
        if(!ticketInfo){
            return;
        }
        return  {
            id:ticketInfo['_id'],
            code: codeInfo['code'],
            code_id : codeInfo['_id'],
            ...ticketInfo,
        }
    }

    async getUserTickList(page=0) {
        page = parseInt(page);
       
        const historyModel = load.loadModel(this.ctx, 'history');
        const ticketList = await historyModel.getMyTickList(page);
        if(!ticketList || ticketList.length < 1) {
            return [];
        }
        let filterList = [];
        let codeIds = ticketList.map(item => {
            return item['code_id']
        });

        const codeModel = load.loadModel(this.ctx, 'code');
        const codeInfos = await codeModel.queryTickIds(codeIds);
        if(!codeInfos || codeInfos.length < 0){
            return [];
        }

        for(const item of ticketList){
            if(!item['code_id']){
                return;
            }
            let codeInfo = codeInfos[item['code_id']];
            if(!codeInfo || !codeInfo['ticket_id'] || !codeInfo['code']){
                return;
            }
            let ticketInfo = await this.getTicketInfo(codeInfo['ticket_id']);
            if(!ticketInfo){
                return;
            }
            delete ticketInfo['_id'];

            filterList.push(
                {
                    id:item['_id'],
                    code: codeInfo['code'],
                    code_id : item['code_id'],
                    ...ticketInfo,
                }
            );
        }

        return filterList;
    }

    async getTicketInfo(id) {
        if(!id){
            return false;
        }
        let ticketInfo = await cache.get(TICKET_DETAIL_CACHE_KEY.replace('{ticketId}', id));
        if(ticketInfo){
            return ticketInfo;
        }
        const ticketModel = load.loadModel(this.ctx, 'ticket');
        ticketInfo = await ticketModel.getOneById(id);
        if(ticketInfo) {
            this.cacheDetail(ticketInfo).then();
        }
        return ticketInfo;
    }

    async cacheDetailById(id) {
        if(!id){
            return false;
        }
        const ticketModel = load.loadModel(this.ctx, 'ticket');
        const ticketInfo = await ticketModel.getOneById(id);
        return await this.cacheDetail(ticketInfo);
    }

    async cacheDetail(ticketInfo) {
        if(!ticketInfo){
            return;
        }
        let ret = await cache.set(TICKET_DETAIL_CACHE_KEY.replace('{ticketId}', ticketInfo['_id']), ticketInfo, CACHE_TIME_SEC, true);
        if(!ret){
            this.log('error', `cache act info ${ticketInfo['_id']} list error`, ticketInfo);
        }
        return ret;
    } 
}

module.exports = TicketService;