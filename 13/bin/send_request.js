const ApiCenter = require('../src/core/apiCenter');

for(let i=500; i<1000; i++){
    ApiCenter.callApi(`http://127.0.0.1:3000/v1/test?username=${i}`);
}