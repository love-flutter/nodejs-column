const Controller = require('../../core/controller');

class MusicInfo extends Controller {

    index() {
        return this.resApi(true, 'music info is good');
    }


}

module.exports = MusicInfo;