const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
// npm i express-error-handler
const expressErrorHandler = require('express-error-handler');
// npm i passport
const passport = require('passport');
// npm i socket.io
const socketio = require('socket.io');
// npm i cors
const cors = require('cors')


const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(logger('dev'));
// 클라이언트에서 ajax로 요청
app.use(cors());

// passport 사용설정
// passport의 세션을 사용하려면 그 전에 express의 세션을 사용하는 코드가 먼저 나와야 합니다.
app.use(passport.initialize()); // 초기화
app.use(passport.session());    // 패스포트 세션 사용

app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', static(path.join(__dirname, 'public')));

app.use('/', router);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// localhost:3000/views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const config = require('./config/config');
const database = require('./database/database');

// 패스포트 설정
const configPassport = require('./config/passport');
configPassport(app, passport);

// 라우터 설정
const userPassport = require('./routes/route_member');
userPassport(router, passport);

console.log('라우터 설정 완료!');

// app.listen(config.server_port, () => {
//     console.log(`${config.server_port}포트로 서버 실행중 ...`);
//     database.init(app, config);
// })

const server = app.listen(config.server_port, () => {
    console.log(`${config.server_port}포트로 서버 실행중 ...`);
    database.init(app, config);
});

const io = socketio(server);
console.log('socket.io 준비 완료!');

let login_ids = {};

io.sockets.on('connection', (socket) => {
    console.dir(`connection : ${socket.request.connection._peername}`);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    console.log(`socket.remoteAddress : ${socket.remoteAddress}`);
    console.log(`socket.remotePort : ${socket.remotePort}`);

    socket.on('login', function(login) {
        console.log('login 이벤트를 받았습니다.');
        console.dir(login);
        console.log(`접속한 소켓의 id : ${socket.id}`);
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;

        console.log(`접속한 클라이언트 id의 갯수 : ${Object.keys(login_ids).length}`);
        sendresponse(socket, 'login', '200', '로그인되었습니다.');
    });

    socket.on('message', function(message) {
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);

        if(message.recepient == 'all'){
            console.log('모든 클라이언트에게 message를 보냅니다.');
            io.sockets.emit('message', message);
        }
    });

    socket.on('room', function(room){
        console.log('room 이벤트를 받았습니다.');
        console.dir(room);
        console.log(room.command);
        if(room.command == "create"){
            if(io.sockets.adapter.rooms[room.roomId]){
                console.log('방이 이미 만들어져 있습니다.');
            }else{
                console.log('방을 새로 만듭니다.');
                socket.join("room.roomId");
                console.log(io.sockets.adapter.rooms[room.roomId]);
                let curRoom = io.sockets.adapter.rooms[room.roomId];
                curRoom.id = room.roomId;
                curRoom.name = room.roomName;
                curRoom.owner = room.roomOwner;
            }
        }else if(room.command == "update"){
            console.log('방제를 바꿉니다.');
            let curRoom = io.sockets.adapter.rooms[room.roomId];
            curRoom.id = room.roomId;
            curRoom.name = room.roomName;
            curRoom.owner = room.roomOwner;
        }else if(room.command == "delete"){
            console.log('방을 없앱니다.');
            socket.leave(room.roomId);
            if(io.sockets.adapter.rooms[room.roomId]){
                delete io.sockets.adapter.rooms[room.roomId];
            }else{
                console.log('방이 만들어져 있지 않습니다.');
            }
        }else if(room.command == "join"){
            console.log('방에 참여합니다.');
            socket.join(room.roomId);
            sendresponse(socket, 'room', '200', '방에 입장하였습니다.');

        }else if(room.command == "leave"){
            console.log('방을 나갑니다.');
            socket.leave(room.roomId);
            sendresponse(socket, 'room', '200', '방에서 나갔습니다.');
        }else{
            console.log('command가 적용 안됨');
        }
        const roomList = getRoomList();
        const output = {command:'list', rooms:roomList};
        console.log(`클라이언트로 보낼 데이터 : ${JSON.stringify(output)}`);
        io.sockets.emit('room', output);
    });
});

function sendresponse(socket, command, code, message){
    const statusObj = {command: command, code: code, message: message };
    socket.emit('response', statusObj);
}

function getRoomList(){
    console.dir(io.sockets.adapter.rooms);
    let roomList = [];
    Object.keys(io.sockets.adapter.rooms).forEach(function(roomId){
        console.log(`현재 room id : ${roomId}`);
        const outRoom = io.sockets.adapter.rooms[roomId];
        const foundDefault = false;
        let index = 0;

        Object.keys(outRoom.sockets).forEach(function(key) {
            console.log(`# ${index} : ${key}, ${outRoom.sockets[key]}`);
            if(roomId == key){
                foundDefault = true;
                console.log('여기는 기본방');
            }
            index++;
        });
        if(!foundDefault){
            roomList.push(outRoom);
        }
    });
    console.log('***** ROOM LIST *****');
    console.log(roomList);
    return roomList;
}