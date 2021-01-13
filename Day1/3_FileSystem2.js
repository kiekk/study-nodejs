const fs = require('fs');
const data = "Hello Node.js !!!!";

fs.writeFile('text2.txt', data, 'utf-8', (err) => {
    if(err){
        console.log('error!!');
    }else{
        console.log('저장완료!! - 비동기');
    }
});

fs.writeFileSync('text3.txt', data, 'utf-8');
console.log('저장완료!! - 동기');



