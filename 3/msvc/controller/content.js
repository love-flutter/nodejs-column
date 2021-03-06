const Controller = require('../core/controller');
const ContentModel = require('../model/content');
const contentService = require('../service/content')();

class Content extends Controller {

    constructor(res, req) {
        super(res, req);
    }

    async list() {
        let contentList = await new ContentModel().getList();

        contentList = await contentService.filterUserinfo(contentList);
        
        return this.resApi(true, 'success', contentList);
    }

    test() {
        return this.resApi(true, 'good');
    }
}

module.exports = Content;