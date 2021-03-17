let singleton;

const userList = [];
class Singleton {
    add(uid) {
        userList.push(uid);
    }

    getLength() {
        return userList.length;
    }
}

module.exports = () => {
    if(singleton){
        return singleton;
    }

    singleton = new Singleton();
    return singleton;
}