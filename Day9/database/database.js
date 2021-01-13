const mongoose = require('mongoose');

let database = {};

database.init = function(app, config){
    console.log('database init() 호출!');
    connect(app, config);
}

function connect(app, config){
    console.log('connect() 호출!');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.db.on('open', () => {
        console.log('데이터베이스 연결 성공!');
        createSchema(app, config);
    });
}

function createSchema(app, config){
    const schemaLen = config.db_schemas.length;
    console.log('설정 정의된 스키마의 개수 : %d', schemaLen);

    for(let i=0; i<schemaLen; i++){ // i=0
        let curItem = config.db_schemas[i]; // {file:'./member_schema', collection:'member2', schemaName:'MemberSchema', modelName:'MemberModel'}
        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log(`${curItem.file} 모듈을 불러들인 후 스키마를 정의함`, curItem.file);

        let curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함', curItem.collection);

        database[curItem.schemaName] = curSchema;  // database[member_schema]
        database[curItem.modelName] = curModel;     // database[member2]
        console.log('스키마이름[%s], 모델이름[%s]이 데이터베이스 객체의 속성으로 추가되었습니다.', curItem.schemaName, curItem.modelName);
        app.set('database', database);
        console.log('database 객체가 app객체의 속성으로 추가됨');
    }
}
module.exports = database;


