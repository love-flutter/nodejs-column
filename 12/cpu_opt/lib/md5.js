crypto = require('crypto');

// 保存缓存信息
const md5Cache = {};

module.exports = (content) => { 
    if(md5Cache[content]) { // 判断是否存在缓存信息，存在则直接返回
        return md5Cache[content]
    }
    /** 不存在则计算并返回 */
    md5Cache[content] = crypto.createHash('md5').update(content).digest("hex");
    return md5Cache[content];
}