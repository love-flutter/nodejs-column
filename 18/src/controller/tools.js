const fs = require('fs');
const moment = require('moment');

const Controller = require('../core/controller');
const load = require('../core/load');

class Tools extends Controller {
    async lpop() {
        let actId = this.getParams('actId');
        if(!actId) {
            return this.resApi(false, 'params error');
        } 
        const codeModel = load.loadModel(this.ctx, 'code');
        const ticketCode = await codeModel.lpopCode(actId);
        return this.resApi(true, 'success', ticketCode);
    }

    async delete() {
        let actId = this.getParams('actId');
        if(!actId) {
            return this.resApi(false, 'params error');
        } 
        const codeModel = load.loadModel(this.ctx, 'code');
        const ticketCode = await codeModel.lpopCode(actId);
        return this.resApi(true, 'success', ticketCode);
    }

    async test() {
        try {
            const cache = load.loadLib('cache');
            const ret= await cache.set('test_key', 1);
            const value=await cache.get('test_key');
            if(!ret || value != 1){
                return this.resApi(false, 'connect redis error');
            }
        } catch (error) {
            console.log(error);
            this.log('error', 'connect redis error', {error});
            return this.resApi(false, 'connect redis error');
        }

        try {
            const baseMongo = require('../lib/baseMongodb')();
            const client = await baseMongo.getClient();
            client.db('nodejs_cloumn').collection('test')
        } catch (error) {
            console.log(error);
            this.log('error', 'connect mongodb error', {error});
            return this.resApi(false, 'connect mongodb error');
        }
        return this.resApi(true, 'mongodb and redis connect success');
    }

    /**
     * 
     * @description 从项目根目录的 config/activity.json 中读取配置，并落入数据库
     */
    async init() {
        let activityInfos = [];
        try {
            activityInfos = JSON.parse(fs.readFileSync('./config/activity.json'));
        } catch (error) {
            this.log('error', 'read file error', error);
            return this.resApi(false, 'failed');
        }
        
        /// 加载相应的 Model 和 Service
        let allRet = true;
        const actModel = load.loadModel(this.ctx, 'act');
        const ticketModel = load.loadModel(this.ctx, 'ticket');

        const codeService = load.loadService(this.ctx, 'code');
        const actService = load.loadService(this.ctx, 'act');

        for(const activityInfo of activityInfos){ // 循环处理导入
            let actInfo = activityInfo['activity_info'];

            const preRowInfo = await actModel.getOneByAid(actInfo['aid']);
            if(preRowInfo){
                this.log('info', 'it has before, continue', preRowInfo);
                continue;
            }
            actInfo['start_time'] = moment().unix();
            actInfo['end_time'] = moment().unix() + actInfo.days * 86400;

            delete actInfo['days'];

            /// 插入活动信息
            let actId = await actModel.insertOne(actInfo);
            if(!actId){
                this.log('error', 'import act error', actInfo);
                continue;
            }

            /// 插入票信息
            let ticketInfo = activityInfo['ticket_info'];
            ticketInfo['act_id'] = actId;
            ticketInfo['start_time'] = moment().unix();
            ticketInfo['end_time'] = moment().unix() + ticketInfo.days * 86400;
            let ticketId = await ticketModel.insertOne(ticketInfo);
            if(!ticketId){
                this.log('error', 'import act error', ticketInfo);
                continue;
            }

            /// 导入券码列表
            const ret = await codeService.import(actId, ticketId, activityInfo['code_list']);
            allRet = allRet && ret;
        }

        // 设置缓存
        await actService.cacheList();

        if(allRet) {
            return this.resApi(true, 'success');
        } 
        return this.resApi(false, 'error', 'pls check the local log');
    }

}

module.exports = Tools;