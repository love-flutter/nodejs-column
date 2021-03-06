crypto = require('crypto');

module.exports = (content) => { 
    return crypto.createHash('md5').update(content).digest("hex");
}