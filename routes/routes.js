module.exports = function(express, app, passport){
    var router = express.Router();

    router.get('/', function(req,res,next){
        res.render('index', {title: "welcome to aDating"});
    })

    function securePages(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect('/');
        }
    }

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_friends', 'public_profile', 'user_events' ] }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect:'/welcome', //if authentication is successful, navigate to this path
        failureRedirect:'/'         //else, navigate here
    }))

    router.get('/welcome', securePages, function(req, res, next){
        res.render('welcome', {title:'Welcome to aDating', user:req.user});
    })

    router.get('/menu', securePages, function(req, res, next){
        res.render('main_menu', {title:'Welcome to menu'});
    })

    router.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    })

    app.use('/', router);
}