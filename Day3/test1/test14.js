//process 객체에 uncaughtException 이벤트를 연결합니다.
process.once('uncaughtException', function(error){
    console.log('예외 발생');
});

//2초 간격으로 예외를 발생시킵니다.
var test = function() {
    setTimeout(test, 2000);
    error.error.error();
};
setTimeout(test, 2000);