const http = require('http');
const url = require('url');
const querystring = require('querystring');
const rq = require('request-promise'); 
  
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
    if('/v1/contents' != pathname) {
      return setResInfo(res, false, 'path not found', null, 404);
    }

    // 从 db 查询数据，并获取，有可能返回空数据
    let contents = await queryData({}, {limit: 10});
    
    contents = await filterUserinfo(contents);

    return setResInfo(res, true, 'success', contents);
});

/**
 * 
 * 启动服务
 */
server.listen(4000, () => {
    console.log('server start http://127.0.0.1:4000');
});

/**
 * @description 在 contents 中增加用户信息
 * @param array contents 
 */
async function filterUserinfo(contents) {
    let userIds = [];
    contents.forEach(content => {
        if(content['user_id']){
            userIds.push(content['user_id']);
        }
    });
    if(userIds.length < 1){
        return addUserinfo(contents);
    }

    let userinfos = await callApi('http://127.0.0.1:5000/v1/userinfos', {user_ids: userIds.join(',')});
    if(!userinfos || userinfos.length < 1) {
        return addUserinfo(contents);
    }

    let mapUserinfo = {};
    userinfos.forEach(item => {
        if(userIds.includes(item.id)){
            mapUserinfo[item.id] = item;
        }
    });

    return addUserinfo(contents, mapUserinfo);
}

/**
 * 
 * @description 调用外部 api，暂时只处理 get 逻辑
 * @param string api 
 * @param string method 
 * @param object params 
 */
async function callApi(api, params={}, method='get') {
    const paramsStr = querystring.stringify(params);
    if(api.indexOf('?') == -1) {
        api = `${api}?`;
    } 
    api = `${api}${paramsStr}`;
    let retStr = await rq(api);
    try {
        retInfo = JSON.parse(retStr);
    } catch (error) {
        return false;
    }
    if(retInfo['ret'] != 0 || !retInfo['data']) {
        return false;
    }
    return retInfo['data'];
}

/**
 * 
 * @desc 在 content 中增加 userinfo
 * @param {*} contents 
 * @param {*} userinfo 
 */
function addUserinfo(contents, mapUserinfo={}) {
    contents = contents.map(content => {
        content['user_info'] = mapUserinfo[content['user_id']] ? mapUserinfo[content['user_id']] : {};
        return content;
    });
    return contents;
}

/**
 * 
 * @description db 数据查询
 * @param object queryOption 
 */
async function queryData(queryOption) {
  const client = await baseMongo.getClient();
  const collection = client.db("nodejs_cloumn").collection("content");
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