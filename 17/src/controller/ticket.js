const Controller = require('../core/controller');

class Ticket extends Controller {

    get() {
        return this.resApi(true, 'success', {
            "id":"111",
            "name":"洗头券",
            "desc":"周六日前往，可免费体验",
            "actId":"1110",
            "isEffective": true,
            "image":"xxxx",
            "start_time":1422222333,
            "end_time":1444444444
          });
    }

    detail() {
        return this.resApi(true, 'success',{
            "id":"111",
            "name":"洗头券",
            "code":"xxxx11",
            "desc":"周六日前往，可免费体验",
            "actId":"1110",
            "isEffective": true,
            "image":"xxxx",
            "start_time":1422222333,
            "end_time":1444444444
        });
    }

    list() {
        return this.resApi(true, 'success',[
            {
              "id":"111",
              "name":"洗头券",
              "desc":"周六日前往，可免费体验",
              "code":"xxxx11",
              "actId":"1110",
              "isEffective": true,
              "start_time":1422222333,
              "end_time":1444444444
            }
        ]);
    }
}

module.exports = Ticket;