process.on('exit', () => {
    console.log('exit 이벤트 발생!');
});

setTimeout(() => {
    console.log('3초 후 시스템 종료');
    process.exit;
}, 3000);


