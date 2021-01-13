const express = require('express');
// npm install serve-ststic
const static = require('serve-static');
const path = require('path')

const app = express();
const port = 3000;

app.use(static(path.join(__dirname, 'public')));

const router = express.Router();

router.route('/sunday').get((req, res) => {
    res.send("<p>요청 이미지 : <img src='/sunday.png' alt='일요일'></p>")
});

app.use('/', router);

app.all('*', (req, res) => {
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen( port, () => {
    console.log(`포트 ${port}번으로 서버 실행중 ...`);
});