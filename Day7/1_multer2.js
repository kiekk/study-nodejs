const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const static = require('serve-static');
const logger = require('morgan');
const fs = require('fs');
const port = 3000;

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', static(path.join(__dirname, 'public')))
app.use('/uploads', static(path.join(__dirname, 'uploads')))
app.use(logger('dev'));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        callback(null, basename + "_" + Date.now() + extension);
    }
}) ;

const upload = multer({
    storage: storage,
    limits: {
        files: 5,
        fileSize: 10 * 1024 * 1024
    }
});

router.route('/mail/write').post(upload.array('photo', 1), (req, res) => {
    console.log('/mail/write 호출!');
    try{
        const files = req.files;
        console.dir(req.files[0]);

        const userid = req.body.userid;
        const email = req.body.email;
        const title = req.body.title;
        const content = req.body.content;

        const originalname = files[0].originalname;
        const filename = files[0].filename;
        const mimetype = files[0].mimetype;
        const size = files[0].size;

        console.log(`파일 정보 : ${originalname}, ${filename}, ${mimetype}, ${size}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: 'ryuzy1011@gmail.com',
                pass: '1111'
            },
            host: 'smtp.gmail.com',
            port: '465'
        });

        fs.readFile('uploads/'+filename, (err, data) => {
            if(err){
                console.log(err);
            }
            const mailOptions = {
                form: "류정원 <ryuzy1011@gmail.com>",
                to: email,
                subject: title,
                text: content,
                attachments: [{'filename': filename, 'content': data}]
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
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>메일 보내기 완료</h2>');
        res.write('<hr>');
        res.write(`<p>아이디 : ${userid}</p>`);
        res.write(`<p>이메일 : ${email}</p>`);
        res.write(`<p>제목 : ${title}</p>`);
        res.write(`<p>내용</p>`);
        res.write(`<p>${content}</p>`);
        res.write(`<p><img src='/uploads/${filename}' width=200></p>`);
        res.end();
    }catch(e){
        console.log(e);
    }
})

app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중 ...`);
});