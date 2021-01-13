const express = require('express');
const app = express();  // 생성자
const port = 3000;

/*
    1XX : 사용자 처리에 따른 에러
    2XX : 정상적인 페이지 호출
    4XX : 페이지 에러
    5XX : 서버 에러
*/

app.use((req, res) => {
    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
    res.end('<h1>익스프레스 서버에서 응답한 메세지입니다.</h1>');
});

app.listen( port, () => {
    console.log(`${port} 포트로 서버 실행중 ... `);
});