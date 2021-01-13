const { Schema } = require('mongoose');
// npm i crypto
const crypto = require('crypto');


Schema.createSchema = function(mongoose){
    console.log('createSchema() 호출');
    const MemberSchema = mongoose.Schema({
        userid: {type: String, require: true, default:''},
        hashed_password: {type: String, default:''},
        name: {type: String, default:''},
        salt: {type: String},
        age: {type: Number, default:''},
        created_at: {type: Date, default: Date.now},
        updated_at: {type: Date, default: Date.now},
        provider: {type: String, default: ''},
        authToken: {type: String, default: ''},
        facebook:{}
    });

    MemberSchema.virtual('userpw')
    .set(function(userpw){
        this._userpw = userpw;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(userpw);
    })
    .get(function(){
        return this._userpw;
    });

    MemberSchema.method('makeSalt', function(){
        console.log('makeSalt() 호출!');
        return Math.round((new Date().valueOf * Math.random())) + '';
    });

    // 1234 / 429084320
    MemberSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){ // 로그인
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
            // 1234 -> DB에 있는 salt을 가져와서 1234 섞어 -> 16진수로 변환 -> 비밀번호
        }else{  // 회원가입
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
            // 1234 -> 3847294와 1234 섞어 -> 16진수로 변환 -> 비밀번호
        }
    });

    MemberSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate 호출 : inSalt(있음)');
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }else{
            console.log('authenticate 호출 : inSalt(없음)');
            return this.encryptPassword(plainText) == this.hashed_password;
        }
    })

    MemberSchema.pre('save', (next) => {
        if(!this.isNew) return next();
        if(!validatePresenceOf(this.userpw)){
            next(new Error('유효하지 않은 password 입니다.'));
        }else{
            next();
        }
    });

    const validatePresenceOf = function(value){
        return value && value.length;   // 데이터가 있는지 여부
    }

    console.log('MemberSchema 정의완료!');
    return MemberSchema;
};

module.exports = Schema;