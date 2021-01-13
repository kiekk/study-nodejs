const express = require('express');
// npm install cookie-parser
const cookieParser = require('cookie-parser');
const { response } = require('express');

const app = express();
const port = 3000;

app.use(cookieParser());

app.get('/setCookie', (req, res) => {
    console.log('setCookie 호출');
    res.cookie('member',
    {
        id: 'apple',
        name: '김사과',
        gender: 'female'
    },
    {
        maxAge: 1000 * 60 * 60
    });
    res.redirect('/showCookie');
});

app.get('/showCookie', (req, res) => {
    console.log('showCookie 호출');
    res.send(req.cookies);
    res.end();
})


app.listen(port, () => {
    console.log(`${port}포트로 서버 실행중 ...`);
})