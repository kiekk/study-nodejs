const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'content-type':'text/html'});
    res.end('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Node.js</title></head><body><p>처음으로 만드는 Node.js 웹서버</p></body></html>');

}).listen(3000, () => {
    console.log('서버 실행중...');
});

// localhost:3000
