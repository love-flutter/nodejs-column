/**
 * 
 * @description 设置响应数据
 * @param object res http res
 * @param boolean ret boolean
 * @param string message string
 * @param object dataInfo object
 * @param int httpStatus
 */
function setResInfo(ctx, ret, message, dataInfo, httpStatus=200) {
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

    ctx.response.type = 'text/plain';
    ctx.response.status = httpStatus;
    ctx.response.body = JSON.stringify(retInfo);
    return;
}

module.exports = {
    setResInfo
}