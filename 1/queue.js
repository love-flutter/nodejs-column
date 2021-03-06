const fs = require('fs');
// 首次事件循环执行
console.log('start');

/// 将会在新的事件循环中的阶段执行
fs.readFile('./config/test.conf', {encoding: 'utf-8'}, (err, data) => {
    if (err) throw err;
    console.log('read file success');
});

setTimeout(() => { // 新的事件循环的起点
    console.log('setTimeout'); 
}, 0);

/// 该部分将会在首次事件循环中执行
Promise.resolve().then(()=>{
    console.log('Promise callback');
});

/// 执行 process.nextTick
process.nextTick(() => {
    console.log('nextTick callback');
});

// 首次事件循环执行
console.log('end');
