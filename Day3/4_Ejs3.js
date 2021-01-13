const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const port = 3000;

const router = express.Router();

const header = fs.readFileSync('header.ejs', 'utf8');
const body = fs.readFileSync('body.ejs', 'utf8');

router.route('/about').post((req, res) => {
    const html = ejs.render(header, {title:'매개변수로 전달된 제목입니다.', content: ejs.render(body, {message:'매개변수로 전달된 텍스트 메세지입니다.'})});
    res.writeHead(200, {'content-type':'text/html'});
    res.end(html);
});

app.use('/', router);
app.all('*', (req, res) => {
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen( port, () => {
    console.log(`포트 ${port}번으로 서버 실행중 ...`);
});
