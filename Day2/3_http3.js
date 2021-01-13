const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
    fs.readFile('nodejs.png', (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.writeHead(200, {'content-type':'image/png'});
            res.end(data);
        }
    })
}).listen(3000, ()=> {
    console.log('이미지 서버 실행중 ... ');
});

http.createServer((req, res) => {
    fs.readFile('rain.mp3', (err, data) =>{
        if(err){
            console.log(err);
        }else{
            res.writeHead(200, {'content-type':'audio/mp3'});
            res.end(data);
        }
    })
}).listen(3001, () => {
    console.log('사운드 서버 실행중 ... ');
})
