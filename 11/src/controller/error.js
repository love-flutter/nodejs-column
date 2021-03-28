const _ = require('lodash');

const Controller = require('../core/controller');
const singleton = require('../lib/singleton')();

class Error extends Controller {

    obj() {
        let data = {
            'userinfo' : {
                'nick' : 'node',
                'name' : 'nodejs',
                'age'  : 10
            }
        };

        let nick = data.userinfo.nick;
        data.userinfo = null; // 中间经过一系列处理，userinfo 被设置为了 null
        let name = data.userinfo.name; // 此时再去访问 userinfo 的信息就无法处理了

        return this.resApi(true, 'good', {nick, name});
    }

    objFix() {
        let data = {
            'userinfo' : {
                'nick' : 'node',
                'name' : 'nodejs',
                'age'  : 10
            }
        };

        let nick = data.userinfo.nick;
        data.userinfo = null; // 中间经过一系列处理，userinfo 被设置为了 null
        if(!data || !data.userinfo){ // 注意既需要判断 data 也需要判断 userinfo
            return this.resApi(true, 'data error');
        }
        let name = data.userinfo.name; // 此时再去访问 userinfo 的信息就无法处理了

        return this.resApi(true, 'good', {nick, name});
    }

    arrObj() {
        let data = {
            'userinfo' : {
                'nick' : 'node',
                'name' : 'nodejs',
                'lastName' : 'js',
                'age'  : 10
            },
            'js-nodejs' : {
                'Chinese' : '90',
                'English' : '80',
                'Mathematics' : '99'
            }
        };

        let lastName = data.userinfo.lastName;
        let name = data.userinfo.name;

        let fullName =  `${lastName} ${name}`; // 获取用户真实姓名，由于数据中使用的是 - 连接，这里使用的是空格，导致了异常 
        let chineseFraction = data[fullName]['Chinese']; // 由于 fullName 不存在，所以会导致异常

        return this.resApi(true, 'good', {chineseFraction});
    }

    arrObjFix() {
        let data = {
            'userinfo' : {
                'nick' : 'node',
                'name' : 'nodejs',
                'lastName' : 'js',
                'age'  : 10
            },
            'js-nodejs' : {
                'Chinese' : '90',
                'English' : '80',
                'Mathematics' : '99'
            }
        };

        let lastName = data.userinfo.lastName;
        let name = data.userinfo.name;

        let fullName =  `${lastName} ${name}`; // 获取用户真实姓名，由于数据中使用的是 - 连接，这里使用的是空格，导致了异常 
        let chineseFraction = _.get(data, `${fullName}.Chinese`, 0); // 使用 lodash 来简化

        let rigthFullName = `${lastName}-${name}`;
        let rightChineseFraction = _.get(data, `${rigthFullName}.Chinese`, 0);

        console.log(rightChineseFraction);

        return this.resApi(true, 'good', {chineseFraction});
    }

    forError() {
        let num = null;
        let str = '123';
        let arr = [1, 2, 3];

        for(let i=0; i<num.length; i++){
            console.log(num[i]);
        }
        for(let i=0; i<str.length; i++){
            console.log(str[i]);
        }
        for(let i=0; i<arr.length; i++){
            console.log(arr[i]);
        }
        return this.resApi(true, 'good');
    }

    forFix() {
        let num = null;
        let str = '123';
        let arr = [1, 2, 3];

        if(num){
            for(let i=0; i<num.length; i++){
                console.log(num[i]);
            }
        }
        if(str){
            for(let i=0; i<str.length; i++){
                console.log(str[i]);
            }
        }
        if(arr){
            for(let i=0; i<arr.length; i++){
                console.log(arr[i]);
            }
        }
        return this.resApi(true, 'good');
    }

    jsonParse() {
        let str = 'nodejs';
        let obj = {};
        try {
            obj = JSON.parse(str);
        } catch (err) {
            console.log(err);
        }
        
        return this.resApi(true, 'good', obj);
    }

    singletonTest() {
        singleton.add('1');
        return this.resApi(true, 'good', singleton.getLength());
    }
}

module.exports = Error;