// 引入 request 库，需要在 package.json 中申明，并且 npm install
const request = require('request');

/**
 * 
 * request 调用外部 api
 * @param {*} apiLink string
 * @param {*} callback funtion
 * 
 */
module.exports = (apiLink, callback) => {
    request(apiLink, function (error, response, body) {
        if(error) {
            callback(false);
        } else {
            callback(body);
        }
    });
}