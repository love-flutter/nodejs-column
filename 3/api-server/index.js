const http = require('http');
const url = require('url');
const querystring = require('querystring');
  
const baseMongo = require('./lib/baseMongodb')();
/**
 * 
 * 创建 http 服务，简单返回
 */
const server = http.createServer(async (req, res) => {
    // 获取 get 参数
    const pathname = url.parse(req.url).pathname;
    paramStr = url.parse(req.url).query,
    param = querystring.parse(paramStr);
    // 过滤非拉取用户信息请求
    if('/v1/userinfos' != pathname) {
      return setResInfo(res, false, 'path not found', null, 404);
    }
    // 参数校验，没有包含参数时返回错误
    if(!param || !param['user_ids']) {
      return setResInfo(res, false, 'params error');
    }

    // 从 db 查询数据，并获取，有可能返回空数据
    const userInfo = await queryData({'id' : { $in : param['user_ids'].split(',')}});
    return setResInfo(res, true, 'success', userInfo);
});

/**
 * 
 * 启动服务
 */
server.listen(5000, () => {
  console.log('server start http://127.0.0.1:5000');
});

/**
 * 
 * @description db 数据查询
 * @param object queryOption 
 */
async function queryData(queryOption) {
  const client = await baseMongo.getClient();
  const collection = client.db("nodejs_cloumn").collection("user");
  const queryArr = await collection.find(queryOption).toArray();

  return queryArr;
}


/**
 * 
 * @description 设置响应数据
 * @param object res http res
 * @param boolean ret boolean
 * @param string message string
 * @param object dataInfo object
 * @param int httpStatus
 */
function setResInfo(res, ret, message, dataInfo, httpStatus=200) {
  let retInfo = {};
  if(!ret) {
    retInfo = {
      'ret' : -1,
      'message' : message ? message : 'error',
      'data' : {}
    };
  } else {
    retInfo = {
      'ret' : 0,
      'message' : message ? message : 'success',
      'data' : dataInfo ? dataInfo : {}
    };
  }
  res.writeHead(httpStatus, { 'Content-Type': 'text/plain' });
  res.write(JSON.stringify(retInfo));
  res.end();
  return;
}