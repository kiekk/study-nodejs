const express = require('express');
const fs = require('fs');
// npm install jade
const jade = require('jade');

const app = express();
const port = 3000;

const router = express.Router();

// http://localhost:3000/userinfo
router.route('/userinfo').post((req, res) => {
    fs.readFile('userinfo.jade', 'utf8', (err, data) => {
        if(!err){
                const jd = jade.compile(data);
                res.writeHead(200, {'content-type':'text/html;chatset=utf-8'});
                res.end(jd({ userid:"apple", name:"김사과", desc:"착해요"}));    
        }else{
            console.log(err);
        }
    });
});

app.use('/', router);
app.all('*', (req, res) => {
    res.status(404).send('<h1>페이지를 찾을 수 없습니다.</h1>');
});

app.listen( port, () => {
    console.log(`포트 ${port}번으로 서버 실행중 ...`);
});