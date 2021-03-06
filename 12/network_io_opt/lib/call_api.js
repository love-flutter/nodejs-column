// 引入 request 库，需要在 package.json 中申明，并且 npm install
const request = require('request');
// 缓存 api 请求结果数据
const apiCacheData = {};

/**
 * 
 * request 调用外部 api
 * @param {*} apiLink string
 * @param {*} callback funtion
 * 
 */
module.exports = (apiLink, callback) => {
    if(apiCacheData[apiLink]) {
        return callback(apiCacheData[apiLink]);
    }
    request(apiLink, {timeout: 3000}, function (error, response, body) {
        if(error) {
            callback(false);
        } else {
            apiCacheData[apiLink] = body;
            callback(body);
        }
    });
}