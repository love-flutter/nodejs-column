const Controller = require('../../core/controller');

class ActivityInfo extends Controller {

    index() {
        return this.resApi(true, 'activity info is good');
    }


}

module.exports = ActivityInfo;