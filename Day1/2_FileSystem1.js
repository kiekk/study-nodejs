const fs = require('fs');   // 파일을 다루는 모듈

fs.readFile('text1.txt', 'utf-8', (err, data) => {  // 비동기 / 콜백
    if(err){
        console.log(err);
    }else{
        console.log(`비동기식으로 읽음 : ${data}`);
    }
});

const text = fs.readFileSync('text1.txt', 'utf-8'); // 동기
console.log(`동기식으로 읽음 : ${text}`);
