const url = require('url');
const querystring = require('querystring');
const rq = require('request-promise'); 

/**
 * 
 * @description 调用外部 api，暂时只处理 get 逻辑
 * @param string api 
 * @param string method 
 * @param object params 
 */
async function callApi(api, params={}, method='get') {
    const paramsStr = querystring.stringify(params);
    if(api.indexOf('?') == -1) {
        api = `${api}?`;
    } 
    api = `${api}${paramsStr}`;
    let retStr = await rq(api);
    try {
        retInfo = JSON.parse(retStr);
    } catch (error) {
        return false;
    }
    if(retInfo['ret'] != 0 || !retInfo['data']) {
        return false;
    }
    return retInfo['data'];
}

module.exports = {
    callApi
};

