const querystring = require('querystring');
const fs = require('fs');

const Controller = require('../../core/controller');

class Fs extends Controller {

    index() {
        const params = querystring.parse(this.ctx.request.querystring);

        // 根据产品名称获取产品的配置信息
        let product = decodeURI(params['product']);
        // 去掉上层目录访问
        product = product.replace('..', '');
        try {
            let productInfo = fs.readFileSync(`${__dirname}/../../config/products/${product}.json`, 'utf8');
            return this.resApi(true, 'good', productInfo);
        } catch(err){
            return this.resApi(false, 'can not find the product');
        }
    }

    writeTest() {
        const params = querystring.parse(this.ctx.request.querystring);
        let renameFilename = decodeURI(params['name']);

        // 上传单个文件
        const file = this.ctx.request.files ? this.ctx.request.files.file : false; // 获取上传文件
        console.log(this.ctx.request.files);
        if(!file){
            return this.resApi(false, 'no file');
        }
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = `${__dirname}/../../../upload/${renameFilename}`;

        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);

        return this.resApi(true, 'success', file.name);
    }

}

module.exports = Fs;

