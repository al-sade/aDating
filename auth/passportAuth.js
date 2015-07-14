module.exports = function(passport, FacebookStrategy, config, mongoose, fbgraph){


    var fbUser = new mongoose.Schema({
        profileID:String,
        fullname:String,
        profilePic:String,
        friends:String,
        events:String
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
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'birthday', 'events', 'profileUrl', 'emails', 'likes']
    }, function(accessToken, refershToken, profile, done){
        //Check if the user exists in our Mongo DB database
        //if not, create one and return the profile
        //if exists, return profile

        var fb = new fbgraph.Facebook(accessToken, 'v2.2');
        fb.me(function(err, me) {
            console.log(me);
        });
        fb.my.events(function(err, events) {
            console.log(events);
        });
        fb.my.friends(function(err, result){
            console.log(result);
        })

        userModel.findOne({'profileID':profile.id}, function(err, result){
            if(result){
                done(null,result);

               console.log(accessToken);

            } else {
                // Create a new user in our mongoLab account
                var newFbUSer = new userModel({
                    profileID: profile.id,
                    fullname: profile.displayName,
                    profilePic:profile.photos[0].value || ''
                    //events:profile.events[0].id

                });
              //  console.log(newFbUSer.profilePic);

                newFbUSer.save(function(err){
                    done(null,newFbUSer);
                })
            }
        })
    }))
}

