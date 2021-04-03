const heapdump = require('heapdump');

const oneHourSecs = 3600;
const oneMinSecs = 60;
const oneDaySecs = 86400;
const oneSecMillisecs = 1000;

module.exports = function (id, startTime='18:12:13', intervals=oneDaySecs) {
    if(!parseInt(intervals) || parseInt(intervals) < 10){
        return;
    }
    const timesArr = startTime.split(':');
    if(timesArr.length<2){
        return;
    }
    let hours = parseInt(timesArr[0]) || 0;
    let mins = parseInt(timesArr[1]) || 0;
    let secs = parseInt(timesArr[2]) || 0;

    const zeroSecs = hours * oneHourSecs + mins * oneMinSecs + secs;

    const date = new Date();
    
    const currentZeroSecs = date.getHours() * oneHourSecs + date.getMinutes() * oneMinSecs + date.getSeconds();

    /// 获取下一次打印日志的循环时间
    let nextTimes = zeroSecs - currentZeroSecs;
    if(nextTimes < 0){
        nextTimes = oneDaySecs + nextTimes;
    }
    console.log(`系统将在 ${nextTimes} 秒后打印首次内存快照，请在首次快照后请求内存泄漏接口`);
    /// 定时打印内存快照
    setTimeout(() => {
        dumpFile(id);
        console.log(`打印首次内存快照成功，请开始请求内存泄漏接口`);
        setInterval(() => { // 循环执行生成快照
            dumpFile(id);
        }, intervals * oneSecMillisecs);
    }, nextTimes * oneSecMillisecs);
}

/**
 * 
 * 打印内存快照
 * @param {string} id 
 */
function dumpFile(id='test') {
    const current = new Date();
    
    const fileName = `./log/heapdump_${id}_${current.getFullYear()}${current.getMonth()+1}${current.getHours()}${current.getMinutes()}${current.getSeconds()}`;
    heapdump.writeSnapshot(`${fileName}.heapsnapshot`);
}