const fs = require('fs');
const URL = require('url').URL;
const http = require('http');
const querystring = require('querystring');
const _ = require('lodash');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

const configPostFile = './post.lua';
const tmpFile = 'post_tmp.lua'
const baseUrl = 'http://127.0.0.1:3000/{url_path}{query_str}';
const baseHtmlUrl = 'http://127.0.0.1:9001/{html_name}';
const testCommand = 'clinic doctor --on-port "wrk \'{test_link}\'" -- node app.js';

const problemLinks = [];
const testMapping = [
    {
        'urlPath' : 'act/list',
        'method' : 'get',
        'getParams' : {
          'page' : 0,
          'token' : 'piu12naern9023izcx'
        },
        'postParams' : {}
    },
    {
      'urlPath' : 'act/detail',
      'method' : 'get',
      'getParams' : {
        'id' : '607bc870647e4cc06f7f3df7',
        'token' : 'piu12naern9023izcx'
      },
      'postParams' : {}
    },
    {
      'urlPath' : 'ticket/list',
      'method' : 'get',
      'getParams' : {
        'token' : 'piu12naern9023izcx'
      },
      'postParams' : {}
    },
    {
      'urlPath' : 'ticket/detail',
      'method' : 'get',
      'getParams' : {
        'token' : 'piu12naern9023izcx',
        'code' : 'YTE82B62K82P03K34'
      },
      'postParams' : {}
    },
    {
      'urlPath' : 'ticket/get',
      'method' : 'get',
      'getParams' : {
        'token' : 'piu12naern9023izcx',
        'actId' : '607bc99b7e96f0c1e8057f3c'
      },
      'postParams' : {
      }
    }
];

startLocalServer( () => {
  startTestLink().then();
});

async function startTestLink() {
  for(let i=0; i<testMapping.length; i++){
    const testInfo = testMapping[i];

    console.log(`开始检测 ${testInfo.urlPath} 的接口性能问题`);

    let queryStr = '';
    if(!_.isEmpty(testInfo.getParams)){
        queryStr = `?${querystring.stringify(testInfo.getParams)}`;
    }
    let url = baseUrl.replace('{url_path}', testInfo.urlPath).replace('{query_str}', queryStr);
    if(testInfo.method == 'post'){
        writePostInfo(testInfo.postParams);
        url = `${url} -s ./bin/${tmpFile}`;
    }
    let command = testCommand.replace('{test_link}', url);
    let resultLink = execSync(`cd ..;${command};exit;`, {encoding: 'utf8'});
    resultLink = resultLink.match(/\/\.clinic\/(\S*)/)[1];
    resultLink = resultLink.trim();

    const fullResultLink = baseHtmlUrl.replace('{html_name}', resultLink);
    
    let testResults = await parseResult(fullResultLink);
    if(testResults && testResults.length > 0 && testResults[0] && testResults[0].text){
      if(testResults[0].text == 'Detected no issue'){
        console.log('该接口无任何异常问题');
        continue;
      }

      console.log(`该接口存在异常\n具体详情请查看项目根目录下的\n./.clinic/${resultLink}`);
      problemLinks.push(
        {
          resultLink,
          url,
          command,
          'problem' : testResults[0].text,
        }
      );
      continue;
    } else {
      console.log('检测过程中有异常，请查看异常情况');
    }
  }

  if(problemLinks.length == 0){
    console.log('恭喜你，所有服务都正常，无需处理任何问题');
  } else {
    console.log('你需要处理以下问题汇总，具体请查看下面详细信息');
    console.log(JSON.stringify(problemLinks));
  }

  process.exit();
}

function writePostInfo(postInfo) {
    let postStr = ''
    if(!_.isEmpty(postInfo)){
        postStr = querystring.stringify(postInfo);
    }
    let postMode = fs.readFileSync(configPostFile, 'utf8');
    postMode = postMode.replace('{post_str}', postStr);
    fs.writeFileSync(tmpFile, postMode, 'utf8');
    return;
}

async function parseResult (resultLink) {
  if(!resultLink || resultLink.indexOf('127.0.0') == -1){
    return false;
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(resultLink);
  let summaryDatas = await page.evaluate(() => {
    let results = [];
    let items = document.querySelectorAll('.summary');
    if(!items){
      return false;
    }
    items.forEach((item) => {
        results.push({
            text: item.innerText,
        });
    });
    return results;
  });
  return summaryDatas;
}

function startLocalServer(callback) {
  /**
   * 
   * 创建 http 服务，简单返回
   */
  const server = http.createServer((req, res) => {
     // 获取 get 参数
     const myUrl = new URL(req.url, `http://${req.hostname}`); 
     let pathname = myUrl.pathname;

    res.writeHead(200,{'Content-Type':'text/html'});

    try {
       // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
      fs.readFile(`../.clinic${pathname}`,'utf-8',function(err,data){
        if(err){
          throw err;
        }
        res.end(data);
      });
    } catch (error) {
      res.end(false);
    }
  });
  server.listen(9001, function(){
    console.log('启动服务开始测试...');
    callback();
  });
}