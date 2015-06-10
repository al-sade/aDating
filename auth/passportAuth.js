module.exports = function(passport, FacebookStrategy, config, mongoose){

    var fbUser = new mongoose.Schema({
        profileID:String,
        fullname:String,
        profilePic:String,
        friends:String,
        profileUrl:String,
        email:String
    })

    var userModel = mongoose.model('fbUser', fbUser);

    passport.serializeUser(function(user,done){
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
        userModel.findOne({'profileID':profile.id}, function(err, result){
            if(result){
                done(null,result);
               // console.log(profile.events);
            } else {
                // Create a new user in our mongoLab account
                var newFbUSer = new userModel({
                    profileID: profile.id,
                    fullname: profile.displayName,
                    profilePic:profile.photos[0].value || '',
                    birthday:profile.birthday,
                    events:profile.photos[0].url,
                    profileUrl:profile.profileUrl

                });
              //  console.log(newFbUSer.profilePic);

                newFbUSer.save(function(err){
                    done(null,newFbUSer);
                })
            }
        })
    }))
}

