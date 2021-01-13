//모듈을 추출합니다.
var fs = require('fs');
var http = require('http');

//웹 서버를 생성하고 실행합니다.
http.createServer(function(request, response){
    //HTML 파일을 읽습니다.
    fs.readFile(__dirname + '/HTMLPage.html','utf8', function(error, data){
         // 2.1 읽으면서 오류가 발생하면 오류의 내용을
      if(error){
        response.writeHead(500, {'Content-Type':'text/html'});
        response.end('500 Internal Server Error : '+error);
      // 2.2 아무런 오류가 없이 정상적으로 읽기가 완료되면 파일의 내용을 클라이언트에 전달
      }else{
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end(data);
      }
    });
}).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
});