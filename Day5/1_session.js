const express = require('express');
// npm install express-session -> npm i express-session
const expressSession = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false,
    saveUninitialized: true
}));


// http://localhost:3000/login?userid=apple&userpw=1234&username=김사과
app.get('/login', (req, res) => {
    const userid = req.query.userid;
    const userpw = req.query.userpw;
    const username = req.query.username;

    if(!req.session.member){
        req.session.member = {
            id: userid,
            name: username,
            isauth: true
        };
        res.writeHead(200, {'content-type':'text/html; charset=utf8;'});
        res.write('<h2>세션이 생성되었습니다.</h2>');
        res.write(`<p>아이디 : ${userid} </p>`);
        res.write(`<p>비밀번호 : ${userpw} </p>`);
        res.write(`<p>이름 : ${username} </p>`);
        res.write(`<p><a href='/main'>메인으로 이동</a></p>`);
        res.end();
    }else{
        console.log('이미 로그인 중입니다.');
        res.redirect('/main');
    }
});

app.get('/main', (req, res) => {
    if(req.session.member){
        console.log(req.session.member);
        fs.readFile('welcome.html', 'utf8', (err, data) => {
            res.writeHead(200, {'content-type':'text/html; charset=utf-8;'});
            res.end(data);
        });
    }else{
        fs.readFile('fail.html', 'utf8', (err, data) => {
            res.writeHead(200, {'content-type':'text/html; charset=utf-8;'});
            res.end(data);
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy( () => {
        console.log('세션이 삭제되었습니다.');
    });
    res.redirect('/main');
});


app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중 ...`);
})