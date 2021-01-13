const express = require('express');
// npm i mongodb
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}))

const router = express.Router();

let database;

// mongodb 연결 함수
function connectDB(){
    const databaseUrl = "mongodb://localhost:27017";
    MongoClient.connect(databaseUrl, (err, db) => {
        if(err){
            console.log(err);
        }else{
            const tempdb = db.db('nodedb');
            database = tempdb;
            console.log('mongodb 데이터베이스 연결 성공!');
        }
    });
}

// Rest 작성
// localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    console.log('/member/regist 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.username;
    const age = req.body.userage;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(database){
        addMember(database, userid, userpw, name, age, (err, result) => {
            if(err){
                console.log(err);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>서버 오류 발생! 회원가입에 실패했습니다.</p>');
                res.end();
            }
            if(result.insertedCount > 0){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공</h2>');
                res.write('<p>회원가입이 성공적으로 되었습니다.</p>');
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.write('<p>회원가입에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

// localhost:3000/member/login (post)
router.route('/member/login').post((req, res) => {
    console.log('/member/login 호출!');
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}`);

    if(database){
        loginMember(database, userid, userpw, (err, result) => {
            if(err){
                console.log(err);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>서버 오류 발생! 로그인에 실패했습니다.</p>');
                res.end();
            }
            if(result){
                console.dir(result);    // 객체확인
                const resultUserid = result[0].userid;
                const resultUserpw = result[0].userpw;
                const resultUserName = result[0].username;

                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공!</h2>');
                res.write(`<p>아이디 : ${resultUserid}</p>`);
                res.write(`<p>비밀번호 : ${resultUserpw}</p>`);
                res.write(`<p>이름 : ${resultUserName}</p>`);
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('아이디 또는 비밀번호를 확인하세요.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});

// localhost:3000/member/edit (post)
router.route('/member/edit').post((req, res) => {
    console.log('/member/edit 호출!');

    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.username;
    const age = req.body.userage;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(database){
        editMember(database, userid, userpw, name, age, (err, result) => {
            if(err){
                console.log(err);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 수정 실패</h2>');
                res.write('<p>서버 오류 발생! 정보 수정에 실패했습니다.</p>');
                res.end();
            }
            if(result.modifiedCount > 0){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 수정 성공</h2>');
                res.write('<p>회원정보 수정에 성공했습니다.</p>');
                res.end();  
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 수정 실패</h2>');
                res.write('<p>정보 수정에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }

});


// localhost:3000/member/delete (post)
router.route('/member/delete').post((req, res) => {
    console.log('/member/delete 호출!');

    const userid = req.body.userid;

    console.log(`매개변수 : userid:${userid}`);
    
    if(database){
        deleteMember(database, userid, (err, result) => {
            if(err){
                console.log(err);
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 삭제 실패</h2>');
                res.write('<p>서버 오류 발생! 정보 삭제에 실패했습니다.</p>');
                res.end();
            }
            if(result.deletedCount > 0){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 삭제 성공</h2>');
                res.write('<p>회원정보 삭제에 성공했습니다.</p>');
                res.end();  
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원정보 삭제 실패</h2>');
                res.write('<p>정보 삭제에 실패했습니다.</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
});


// 회원가입 db 저장
const addMember = function(database, userid, userpw, name, age, callback){
    console.log('addMember 호출!');
    const members = database.collection('member');

    members.insertMany([{userid:userid, userpw:userpw, username:name, age:age}], (err, result) => {
        if(err){
            console.log(err);
            callback(err, null);    // err:err object, result:null
            return;
        }
        if(result.insertedCount > 0){
            console.log(`사용자 document ${result.insertedCount} 추가 되었음!`);
        }else{
            console.log(`사용자 document 추가되지 않음!`);
        }
        callback(null, result);
    });
}

// 로그인 확인
const loginMember = function(database, userid, userpw, callback){
    console.log('loginMember 호출!');
    const members = database.collection('member');
    // result[0] result[1] ..
    members.find({userid:userid, userpw:userpw}).toArray((err, result) => {
        if(err){
            console.log(err);
            callback(err, null);    // err:err object, result:null
            return;
        }
        if(result.length > 0){
            console.log('사용자를 찾았습니다!');
            callback(null, result);
        }else{
            console.log('일치하는 사용자를 찾지 못했습니다.');
            callback(null, null);
        }
    })
}

// 회원정보 수정
const editMember = function(database, userid, userpw, name, age, callback){
    console.log('editMember 호출!');

    const members = database.collection('member');

    members.updateOne({userid:userid}, {$set:{userid:userid, userpw:userpw, username:name, age:age}}, (err, result) => {
        if(err){
            console.log(err);
            callback(err, null);    // err:err object, result:null
            return;
        }
        if(result.modifiedCount > 0){
            console.log(`사용자 document ${result.modifiedCount}개 수정됨`);
        }else{
            console.log('수정된 document가 없음');
        }
        callback(null, result);
    });
}

// 회원정보 삭제
const deleteMember = function(database, userid, callback){
    console.log('deleteMember 호출!');
    const members = database.collection('member');

    members.deleteOne({userid:userid}, (err, result) => {
        if(err){
            console.log(err);
            callback(err, null);    // err:err object, result:null
            return;
        }
        if(result.deletedCount > 0){
            console.log(`사용자 document ${result.deletedCount}개가 삭제됨`);
        }else{
            console.log(`사용자 document가 삭제되지 않음`);
        }
        callback(null, result);
    });
}


app.use("/", router);

app.listen(port, () => {
    console.log(`${port}포트로 서버 동작중 ... `);
    connectDB();
});