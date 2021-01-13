module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/nodedb',
    db_schemas: [{file:'./member_schema', collection:'member2', schemaName:'MemberSchema', modelName:'MemberModel'}],
    route_info: [],
    facebook: {
        clientID: '2441217422841289',
        clientSecret: '4f5ae46d8b22825189cac4fb42f3438a',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}