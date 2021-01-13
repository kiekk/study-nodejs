const express = require('express');
const app = express();  // 생성자
const port = 3000;

app.use((req, res, next) => {
    console.log('첫번째 미들웨어 실행');
    req.user = 'apple';
    next();
});

app.use('/', (req, res, next) => {
    console.log('두번째 미들웨어 실행');
    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
    res.end(`<h1>${req.user}</h1>`);
});

app.listen( port, () => {
    console.log(`${port} 포트로 서버 실행중 ... `);
});