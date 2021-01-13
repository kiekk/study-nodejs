//시간 측정 시작
console.time('alpha');

var output = 1;
for (var i=0; i<= 10; i++){
    output += i;
}
console.log("Result : " + output);

//시간 측정 종료
console.timeEnd('alpha');