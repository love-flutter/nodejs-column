const Controller = require('../core/controller');
const load = require('../core/load');

class Ticket extends Controller {

    async get() {
        let actId = this.getParams('actId');
        if(!actId) {
            return this.resApi(false, 'params error');
        } 
        const actService = load.loadService(this.ctx, 'act');
        const checkRet = await actService.checkCanJoin(actId);
        if(checkRet == -1){
            return this.resApi(false, 'params error');
        }
        if(checkRet !== 0){
            return this.resApi(false, 'you have already join', {'errCode':1001, checkRet});
        }
        const codeService = load.loadService(this.ctx, 'code');
        const ticketCode = await codeService.getOneCode(actId);
        if(ticketCode == 1){
            return this.resApi(false, 'no more ticket code', {'errCode':2001});
        }
        if(ticketCode == -1){
            return this.resApi(false, 'server error, pls retry later', {'errCode':3001});
        }

        let ticketInfo = {};
        const ticketId = await codeService.getTicketIdByCode(ticketCode);
        if(!ticketId){
            this.log('error', 'get code ticket mapping error', {ticketCode});
        } else {
            const ticketService = load.loadService(this.ctx, 'ticket');
            ticketInfo = await ticketService.getTicketInfo(ticketId);
        }

         // 异步记录历史数据，避免抢票后，无法查看个人票信息，此处为异步，为了性能考虑，部分丢失数据可以后续在补充
         const historyService = load.loadService(this.ctx, 'history');
         historyService.insertHistory(actId, ticketCode).then(ret => {
             // 无需处理，已经在 historyService 中处理，并告警提示
         });

        return this.resApi(true, 'success', {
            ...ticketInfo,
            code: ticketCode
        });
    }

    async detail() {
        let ticketCode = this.getParams('code');
        if(!ticketCode) {
            return this.resApi(false, 'params error');
        } 
        const ticketService = load.loadService(this.ctx, 'ticket');
        const ticketInfo = await ticketService.getTicketByCode(ticketCode);
        if(!ticketInfo) {
            return this.resApi(true, 'success');
        }
        return this.resApi(true, 'success', ticketInfo);
    }

    async list() {
        let page = parseInt(this.getParams('page'));
        if(!page || page < 0) {
            page = 0;
        } 
        const ticketService = load.loadService(this.ctx, 'ticket');
        const ticketList = await ticketService.getUserTickList(page);
        if(!ticketList || ticketList.length < 1) {
            return this.resApi(true, 'success', []);
        }
        return this.resApi(true, 'success', ticketList);
    }

    async importCode() {
        let actId = this.getParams('actId');
        let codeStr = this.getParams('codeList');
        let ticketId = this.getParams('ticketId');

        const codeList = codeStr.split(',');
        if(!codeList || !ticketId || !actId){
            return this.resApi(false, 'params error', {codeStr, ticketId, actId});
        }

        const codeService = load.loadService(this.ctx, 'code');
        
        const ret = await codeService.import(actId, ticketId, codeList);
        if(!ret){
            return this.resApi(true, 'failed');
        }
        return this.resApi(true, 'success');
    }
}

module.exports = Ticket;