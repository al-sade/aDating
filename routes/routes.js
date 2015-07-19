module.exports = function(express, app, passport){
    var router = express.Router();
    var data = require('../data/process_data.js');




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

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends', 'public_profile', 'user_events' ] }));
        router.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect:'/welcome', //if authentication is successful, navigate to this path
            failureRedirect:'/'         //else, navigate here
        }))

    router.get('/welcome', securePages, function(req, res, next){
        res.render('welcome', {title:'Welcome to aDating', user:req.user});
    })

    router.get('/menu', securePages, function(req, res, next){
        res.render('main_menu', {title:'Welcome to aDating' });
    })

    router.get('/upcoming_events', securePages, function(req, res, next){
        console.log(data.users.users);

        //console.log(JSON.parse(users.users));
            res.render('upcoming_events', {
                title: 'Welcome to aDating - Upcoming Events',
                event_name_1:data.events.events[2].eventName,
                event_location_1:data.events.events[2].location,
                event_time_1:data.events.events[2].time,
                cover_photo_1:data.events.events[2].eventPic,
                event_name_2:data.events.events[3].eventName,
                event_location_2:data.events.events[3].location,
                event_time_2:data.events.events[3].time,
                cover_photo_2:data.events.events[3].eventPic,
                event_name_3:data.events.events[4].eventName,
                event_location_3:data.events.events[4].location,
                event_time_3:data.events.events[4].time,
                cover_photo_3:data.events.events[4].eventPic,
                event_name_4:data.events.events[4].eventName,
                event_location_4:data.events.events[4].location,
                event_time_4:data.events.events[4].time,
                cover_photo_4:data.events.events[4].eventPic,
                user_pic_1:data.users.users[2].profilePic,
                user_pic_2:data.users.users[3].profilePic,
                user_pic_3:data.users.users[5].profilePic,
                user_pic_4:data.users.users[6].profilePic,
                user_pic_5:data.users.users[1].profilePic
            });
    })

    router.get('/profile', securePages, function(req, res, next){
        res.render('profile', {title:'Welcome to aDating - Profile'});
    })

    router.get('/calendar', securePages, function(req, res, next){
        res.render('calendar', {title:'Welcome to aDating - Calendar'});
    })

    router.get('/requests', securePages, function(req, res, next){
        res.render('requests', {title:'Welcome to aDating - Requests'});
    })

    router.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    })

    app.use('/', router);
}