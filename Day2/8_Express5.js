const express = require('express');
const app = express();
const port = 3000;

// http://localhost:3000/?userid=apple
app.use((req, res) => {
    console.log('첫번째 미들웨어 실행');

    const userAgent = req.header('User-Agent');
    console.log(userAgent);

    const paramName = req.query.userid;
    console.log(paramName);

    res.writeHead(200, {'content-type':'text/html;charset=utf8'});
    res.write('<h1>익스프레스 서버에서 응답한 메세지입니다.</h1>');
    res.write(`<p>User-Agent : ${userAgent}</p>`);
    res.write(`<p>paramName : ${paramName}</p>`);
    res.end();
})

app.listen( port, () => {
    console.log(`${port} 포트로 서버 실행중 ... `);
});
