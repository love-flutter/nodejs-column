const serviceMapping = {
    'poxyBackendServer' : [
        '127.0.0.1:3002',
        '127.0.0.1:3003',
    ]
};
class NameService {
    static get(name) {
        if(!serviceMapping[name] || serviceMapping[name].length < 1){
            return false;
        }
        const serviceList = serviceMapping[name];
        return serviceList[Math.floor(Math.random()*serviceList.length)];
    }
}

module.exports = NameService;