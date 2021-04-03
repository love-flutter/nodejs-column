const querystring = require('querystring');

const Controller = require('../../core/controller');

class Xss extends Controller {

    index() {
        const params = querystring.parse(this.ctx.request.querystring);

        let name = decodeURI(params['name']);
        
        return this.ctx.response.body = name;
        //return this.resApi(true, 'good', a);
    }

}

module.exports = Xss;