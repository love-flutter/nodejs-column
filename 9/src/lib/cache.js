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
                host: 'redis-17353.c245.us-east-1-3.ec2.cloud.redislabs.com',
                port: 17353,
                password: 'nodejs@2021',
                db: 0
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
            console.log(`local value is ${value}`);
        }
        if(!value && this.redisEnable) {
            try {
                value = await promisify(this.client.get).bind(this.client)(key);
                console.log(`redis value is ${value}`)
            } catch (err){
                console.log(err);
            }
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
        if(this.localCacheEnable && cacheLocal) {
            localCacheRet = this.myCache.set(key, value, expire);
        }
        if(this.redisEnable) { 
            try {
                redisRet = await promisify(this.client.set).bind(this.client)(key, value, 'EX', expire);
            } catch (err){
                console.log(err);
            }
        }
        return localCacheRet || redisRet;
    }

    async getRedis() {
        if(!this.redisEnable){
            return null;
        }
        return this.client;
    }
}

module.exports = function(localCacheEnable=true, redisEnable=true) {
    return new Cache(localCacheEnable, redisEnable);
};