const querystring = require('querystring');

const Controller = require('../../core/controller');

class Sql extends Controller {

    index() {
        const params = querystring.parse(this.ctx.request.querystring);

        let name = decodeURI(params['name']);

        /// connection 是 mysql 的链接句柄
        let queryStr    = 'SELECT * FROM student WHERE name = "' + name + '"'; 
        //connection.query(queryStr, function(err, results) {});
        console.log(queryStr);

        return this.resApi(true, 'good', queryStr);
    }

}

module.exports = Sql;

