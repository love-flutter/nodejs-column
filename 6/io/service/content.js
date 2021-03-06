const ApiCenter = require('../core/apiCenter');

let contentService;

class ContentService {
    async filterUserinfo(contents) {
        let userIds = [];
        contents.forEach(content => {
            if(content['user_id']){
                userIds.push(content['user_id']);
            }
        });
        if(userIds.length < 1){
            return this._addUserinfo(contents);
        }

        let userinfos = await ApiCenter.callApi('http://127.0.0.1:5000/v1/userinfos', {user_ids: userIds.join(',')});
        if(!userinfos || userinfos.length < 1) {
            return this._addUserinfo(contents);
        }

        let mapUserinfo = {};
        userinfos.forEach(item => {
            if(userIds.includes(item.id)){
                mapUserinfo[item.id] = item;
            }
        });

        return this._addUserinfo(contents, mapUserinfo);
    }

    /**
     * 
     * @desc 在 content 中增加 userinfo
     * @param {*} contents 
     * @param {*} userinfo 
     */
    _addUserinfo(contents, mapUserinfo={}) {
        contents = contents.map(content => {
            content['user_info'] = mapUserinfo[content['user_id']] ? mapUserinfo[content['user_id']] : {};
            return content;
        });
        return contents;
    }
}

module.exports = function() {
    if(!contentService){
        contentService = new ContentService();
     }
     return contentService;
}