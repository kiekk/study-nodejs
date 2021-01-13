module.exports = function(router, passport){
    console.log('route_member 호출!');

    router.route('/').get((req, res) => {
        res.render('index.ejs');
    });

    router.route('/signup').get((req, res) => {
        res.render('signup.ejs');
    });

    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.route('/profile').get((req, res) => {
        if(!req.user){
            console.log('사용자 인증이 안된 상태!');
            res.redirect('/');
            return;
        }
        console.log('사용자 인증된 상태');
        if(Array.isArray(req.user)){
            res.render('profile.ejs', {user: req.user[0]});
        }else{
            res.render('profile.ejs', {user: req.user});
        }
    });

    router.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    });

    router.route('/login').get((req, res) => {
        res.render('login.ejs');
    });

    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));
}