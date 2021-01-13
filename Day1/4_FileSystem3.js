const fs = require('fs');

// 비동기처리는 예외처리를 할 필요가 없습니다.
fs.readFile("text11.txt", 'utf-8', (err, data) => {
    if(err){
        console.log('에러 발생! -  비동기');
    }else{
        console.log(data);
    }
});

try{
    const text = fs.readFileSync('text11.txt', "utf-8");
    console.log(text);
}catch(e){
    // console.log(e);
    console.log('에러 발생! - 동기')
}

