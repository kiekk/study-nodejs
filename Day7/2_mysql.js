const express = require('express');
const bodyparser = require('body-parser');
// npm i mysql
const mysql = require('mysql');
const logger = require('morgan');

const app = express();
const port = 3000;
const router = express.Router();

app.use(logger('dev'));
app.use(bodyparser.urlencoded({extended: false}));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'nodestudy',
    debug: false
});

// localhost:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(pool){
        addMember(userid, userpw, name, age, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 완료</h2>');
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});


// localhost:3000/member/login (post)
router.route('/member/login').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}`);

    if(pool){
        loginMember(userid, userpw, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result){
                console.dir(result);
                const name = result[0].mem_name;
                const age = result[0].mem_age;

                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 성공</h2>');
                res.write(`<p>아이디 : ${userid}</p>`);
                res.write(`<p>이름 : ${name}</p>`);
                res.write(`<p>나이 : ${age}</p>`);
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패</h2>');
                res.write('<h2>아이디 또는 비밀번호를 확인하세요.</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

// localhost:3000/member/edit (post)
router.route('/member/edit').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const age = req.body.age;

    console.log(`매개변수 : userid:${userid}, userpw:${userpw}, name:${name}, age:${age}`);

    if(pool){
        editMember(userid, userpw, name, age, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원수정 완료</h2>');
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원수정 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

// localhost:3000/member/delete (post)
router.route('/member/delete').post((req, res) => {
    const userid = req.body.userid;

    console.log(`매개변수 : userid:${userid}`);

    if(pool){
        deleteMember(userid, (err, result) => {
            if(err){
                console.log(err);
            }
            if(result){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원탈퇴 완료</h2>');
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원탈퇴 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
});

const addMember = function(userid, userpw, name, age, callback){
    console.log('addMember 호출!');

    pool.getConnection((err, conn) => {
        if(err){
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 성공');
        const sql = conn.query('insert into tb_member (mem_userid, mem_pass, mem_name, mem_age) values (?, sha1(?), ?, ?)', [userid, userpw, name, age], (err, result) => {
            conn.release(); // 연결을 해제
            console.log('정상적인 sql 실행!');
            if(err){
                callback(err, null);
                return;
            }
            console.log('가입완료');
            callback(null, result);
        });
    });
}

const loginMember = function(userid, userpw, callback) {
    console.log('loginMember 호출!');

    pool.getConnection((err, conn) => {
        if(err){
            callback(err, null);
            return;
        }
        const sql = conn.query('select mem_idx, mem_userid, mem_pass, mem_name, mem_age from tb_member where mem_userid=? and mem_pass=sha1(?)', [userid, userpw], (err, result) => {
            conn.release();
            console.log('정상적인 sql 실행!');
            if(err){
                callback(err, null);
                return;
            }
            if(result.length > 0){
                console.log('일치하는 사용자를 찾음');
                callback(null, result);
            }else{
                console.log('일치하는 사용자를 없음');
                callback(null, null);
            }
        })
    })
}

const editMember = function(userid, userpw, name, age, callback){
    console.log('editMember 호출!');

    pool.getConnection((err, conn) => {
        if(err){
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 성공');
        const sql = conn.query('update tb_member set mem_pass=sha1(?), mem_name=?, mem_age=? where mem_userid=?', [userpw, name, age, userid], (err, result) => {
            conn.release(); // 연결을 해제
            console.log('정상적인 sql 실행!');
            if(err){
                callback(err, null);
                return;
            }
            console.log('수정완료');
            callback(null, result);
        });
    });
}

const deleteMember = function(userid, callback) {
    console.log('deleteMember 호출!');

    pool.getConnection((err, conn) => {
        if(err){
            callback(err, null);
            return;
        }
        const sql = conn.query('delete from tb_member where mem_userid=?', [userid], (err, result) => {
            conn.release();
            console.log('정상적인 sql 실행!');
            if(err){
                callback(err, null);
                return;
            }
            console.log('삭제완료');
            callback(null, result);
        })
    })
}

app.use('/', router);

app.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행중 ...`);
})


