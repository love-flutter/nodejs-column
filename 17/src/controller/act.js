const Controller = require('../core/controller');

class Act extends Controller {

    list() {
        return this.resApi(true, 'success', [
            {
                "id":"111",
                "name":"抢洗头券",
                "desc":"周六日前往，可免费体验",
                "image":"xxxx",
                "start_time":1422222333,
                "end_time":1444444444
            }
        ]);
    }

    detail() {
        return this.resApi(true, 'success',
            {
                "id":"111",
                "name":"抢洗头券",
                "desc":"周六日前往，可免费体验",
                "image":"xxxx",
                "start_time":1422222333,
                "end_time":1444444444
            });
    }

}

module.exports = Act;