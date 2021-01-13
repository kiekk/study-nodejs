const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));

const router = express.Router();

// localhost:3000/mail
router.route('/mail').get((req, res) => {
    // mail.html
    fs.readFile('mail.html', 'utf8', (err, data) => {
        if(!err){
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }else{
            console.log(err);
        }
    });
});

router.route('/mailok').post((req, res) => {
    // 메일 보내기!!!
    const fromemail = req.body.fromemail;
    const from = req.body.from;
    const toemail = req.body.toemail;
    const to = req.body.to;
    const title = req.body.title;
    const content = req.body.content;

    const fromMsg = `${from}<${fromemail}>`;
    const toMsg = `${to}<${toemail}>`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: 'ryuzy1011@gmail.com',
            pass: '1111'
        },
        host: 'smtp.mail.com',
        port: '465'
    });
    
    const mailOptions = {
        from: fromMsg,
        to: toMsg,
        subject : title,
        text : content
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        transporter.close();
        if(err){
            console.log(err);
        }else{
            console.log(info);
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