const express = require('express');
const bodyParser = require('body-parser');  // post 데이터를 전달받기 위해

const app = express();
const port = 3000;

// body-parser를 이용해 apllication/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}))
app.use((req, res) => {
    console.log('첫번째 미들웨어 실행');

    const paramId = req.body.userid;
    const paramPw = req.body.userpw;
    
    res.writeHead(200, {'content-type':'text/html;charset=utf8'});
    res.write('<h1>익스프레스 서버에서 응답한 메세지입니다.</h1>');
    res.write(`<p>아이디 : ${paramId}</p>`);
    res.write(`<p>비밀번호 : ${paramPw}</p>`);
    res.end();
})

app.listen( port, () => {
    console.log(`${port} 포트로 서버 실행중 ... `);
});
