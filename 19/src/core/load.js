/**
 * @description 用于加载 model/service/lib 的模块，避免代码可读性差，以及后续不好维护
 */
class Load {
    /**
     * 
     * @description 加载对应的 model 类
     * @param {string} modelName 
     * @param  {object} params 
     */
    static loadModel(ctx, modelName, ...params) {
        if(params.length > 0){
            params.push(ctx);
        } else {
            params = [ctx];
        }
        return this.loadBase(modelName, 'model', params);
    }

    /**
     * 
     * @description 加载对应的 service 类
     * @param {string} serviceName 
     * @param  {object} params 
     */
    static loadService(ctx, serviceName, ...params) {
        if(params.length > 0){
            params.push(ctx);
        } else {
            params = [ctx];
        }
        return this.loadBase(serviceName, 'service', params);
    }

    /**
     * 
     * @description 加载对应的 lib 类
     * @param {string} libName 
     * @param  {object} params 
     */
    static loadLib(libName, ...params) {
        return this.loadBase(libName, 'lib', params);
    }

    /**
     * 
     * @description 基础加载方法
     * @param {string} name 
     * @param {string} type model ｜ service ｜ lib
     * @param  {...any} params 
     */
    static loadBase(name, type, params, ctx) {
        name = this.filterName(name);
        try {
            const ClassInfo = require(`../${type}/${name}`);
            return new ClassInfo(...params);
        } catch (error) {
            console.log(error);
            throw new Error(`${name} ${type} class not found`);
        }
    }
    /**
     * 
     * @description 防止加载异常路径
     * @param {string} nameStr 
     */
    static filterName(nameStr) {
        return nameStr.replace('..', '');
    }
}

module.exports = Load;