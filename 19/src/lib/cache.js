const { promisify } = require("util");
const redis = require("redis");
const NodeCache = require( "node-cache");

class Cache {
    constructor(localCacheEnable=true, redisEnable=true) {
        this.localCacheEnable = localCacheEnable;
        this.redisEnable = redisEnable;
        if(localCacheEnable){
            this.myCache = new NodeCache();
        }

        if(redisEnable) {
            this.client = redis.createClient({
                //host: 'redis-17353.c245.us-east-1-3.ec2.cloud.redislabs.com',
                host: '127.0.0.1',
                //port: 17353,
                port: 6379,
                //password: 'nodejs@2021',
                db: 0,
                connect_timeout: 60
            });
            this.client.on("error", function (err) {
                console.log(err);
                return;
            });
        }
    }

    /**
     * 
     * @description 获取缓存信息
     * @param {string} key 
     */
    async get(key) {
        let value;
        if(this.localCacheEnable) {
            value = this.myCache.get(key);
        }
        if(!value && this.redisEnable) {
            if(!this.client){
                return false;
            }
            try {
                value = await promisify(this.client.get).bind(this.client)(key);
            } catch (err){
                console.log(err);
            }
        }
        try {
            value = JSON.parse(value);
        } catch (error) {
            return value;
        }
        return value;
    }

    /**
     * 
     * @description 保存缓存信息
     * @param {string} key 缓存key
     * @param {string} value 缓存值
     * @param {int} expire 过期时间/秒
     * @param {boolean} cacheLocal 是否本地缓存
     */
    async set(key, value, expire=10, cacheLocal=false) {
        let localCacheRet, redisRet;

        value = typeof value == 'object' ? JSON.stringify(value) : value;

        if(this.localCacheEnable && cacheLocal) {
            localCacheRet = this.myCache.set(key, value, expire);
        }
        if(this.redisEnable) { 
            if(!this.client){
                return false;
            }
            try {
                if(expire == 0 || expire < 0){
                    redisRet = await promisify(this.client.set).bind(this.client)(key, value);
                } else {
                    redisRet = await promisify(this.client.set).bind(this.client)(key, value, 'EX', expire);
                }
            } catch (err){
                console.log(err);
            }
        }
        return localCacheRet || redisRet;
    }

    getRedis() {
        if(!this.redisEnable){
            return null;
        }
        return this.client;
    }
}

module.exports = function(localCacheEnable=true, redisEnable=true) {
    return new Cache(localCacheEnable, redisEnable);
};