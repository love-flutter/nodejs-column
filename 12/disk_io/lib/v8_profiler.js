'use strict';
const v8Profiler = require('v8-profiler-next');
const fs = require('fs');
// 设置采集数据保存的文件名
const title = 'example';

module.exports = {
    'start' : () => {
        // 启动采集，如果需要定时采集，可以将 title 设置为一个动态的根据时间变化的值
        v8Profiler.startProfiling(title, true);
        setTimeout(() => { // 30 秒后采集并导出
          const profile = v8Profiler.stopProfiling(title);
          profile.export(function (error, result) { // 将内容写入指定文件
            fs.writeFileSync(`./cpu_profiler/${title}.cpuprofile`, result);
            profile.delete();
          });
        }, 30 * 1000);
    }
};
