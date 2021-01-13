module.exports = (app, fs) => {
    // localhost:3000
    app.get('/', (req, res) => {
        res.render('index.ejs', {
            length: 10
        });
    });

    // localhost:3000/about
    app.get('/about', (req, res) => {
        res.render('about.html');
    })

    // localhost:3000/list
    app.get('/list', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            console.log(data);
            res.writeHead(200, {'content-type':'text/json;charset=utf-8'});
            res.end(data);
        });
    });

    // localhost:3000/getMember/apple
    app.get('/getMember/:userid', (req, res) => {
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            const member = JSON.parse(data);
            res.json(member[req.params.userid]);
        });
    });

    app.post('/joinMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid;   // apple
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            const member = JSON.parse(data);
            if(member[userid]){
                result["success"] = 101;
                result["msg"] = "duplicate";
                res.json(result);
                return false;
            }
            console.log(req.body);
            member[userid] = req.body; // member[json] = { name: '제이슨', password: '1234' }
            fs.writeFile(__dirname+"/../data/member.json", JSON.stringify(member, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });

    app.put('/updateMember/:userid', (req, res) => {
        const result = {};
        const userid = req.params.userid;
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 100;
            result["msg"] = "invalid request";
            res.json(result);
            return false;
        }
        fs.readFile(__dirname+"/../data/member.json", 'utf8', (err, data) => {
            console.log(data);
            const member = JSON.parse(data);
            member[userid] = req.body;
            fs.writeFile(__dirname+"/../data/member.json", JSON.stringify(member, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    });
    /*
        /delMember/:userid
        method : delete
        1. 아이디가 있는지 여부 / 102, not found
        2. 객체 삭제 -> delete member[ ? ]
    */
    app.delete('/delMember/:userid', (req, res) => {
        let result = {};
        fs.readFile(__dirname + "/../data/member.json", "utf8", (err, data) => {
            console.log(data);
            const member = JSON.parse(data);
            if(!member[req.params.userid]){
                result["success"] = 102;
                result["msg"] = "not found";
                res.json(result);
                return false;
            }
            delete member[req.params.userid];
            fs.writeFile(__dirname+"/../data/member.json", JSON.stringify(member, null, '\t'), 'utf8', (err, data) => {
                result["success"] = 200;
                result["msg"] = "success";
                res.json(result);
            });
        });
    })
}