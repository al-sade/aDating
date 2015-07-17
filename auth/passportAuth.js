module.exports = function(passport, FacebookStrategy, config, mongoose, fbgraph){


    var fbUser = new mongoose.Schema({
        profileID:String,
        fullname:String,
        profilePic:String,
        friends:String,
        events:String,
        age: String
    })

    var userModel = mongoose.model('fbUser', fbUser);

    passport.serializeUser(function(user,done){ //make the user reference available threw multiple pages
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        userModel.findById(id, function(err, user){
            done(err, user);
        })
    })

    passport.use(new FacebookStrategy({
        passReqToCallback: true,
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'gender', 'birthday', 'events', 'profileUrl', 'emails', 'likes']
    }, function(req,accessToken, refershToken, profile, done){
        //Check if the user exists in our Mongo DB database
        //if not, create one and return the profile
        //if exists, return profile

        req.tmpPassport = {};
        var fb = new fbgraph.Facebook(accessToken, 'v2.2');
        fb.me(function(err, me) {
            req.tmpPassport.me = me;
        });
        fb.my.events(function(err, events) {
            //console.log(events);
            req.tmpPassport.events = events;

        });
        fb.my.friends(function(err, result){
            req.tmpPassport.results = result;
        });

       req.myTimer = setTimeout(function() {
           console.log(req.tmpPassport.events);
        }, 1500);


        userModel.findOne({'profileID':profile.id}, function(err, result){
            if(result){
                done(null,result);

            } else {
                // Create a new user in mongoLab account
                var newFbUSer = new userModel({
                    profileID: profile.id,
                    fullname: profile.displayName,
                    profilePic:profile.photos[1].value || ''
                });
              //  console.log(newFbUSer.profilePic);

                newFbUSer.save(function(err){
                    done(null,newFbUSer);
                })
            }
        })
    }))

}

