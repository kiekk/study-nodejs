// npm install nodemailer
const nodemailer = require('nodemailer');

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
    from: "류정원 <ryuzy1011@gmail.com>",
    to: "유정원 <ryuzy@naver.com>",
    subject : "node.js의 nodemailer 테스트중입니다.",
    //text : "안녕하세요. 메일이 잘 전달되나요????? "
    html : "<h1>안녕하세요. 메일이 잘 전달되나요?????</h1><p>정말 잘 되네요~~ </p>"
};

transporter.sendMail(mailOptions, (err, info) => {
    transporter.close();
    if(err){
        console.log(err);
    }else{
        console.log(info);
    }
});


