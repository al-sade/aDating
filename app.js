var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser= require('cookie-parser'),
    fbgraph = require('fbgraphapi'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy

app.set('views', path.join(__dirname, 'views')); //get views from root dir
app.engine('html', require('hogan-express'));
app.set('view engine', 'html'); //set view engine to use html files
app.use(express.static(path.join(__dirname, 'public'))); //tells express find all the static assets files  in ./public (css,images etc)
app.use(cookieParser());


//development/production separation
var env = process.env.NODE_ENV || 'development';
if (env ==='development') {
    //dev specific setting
    app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}))
} else {
    //production specific settings
    app.use(session({
        secret:config.sessionSecret,
        store: new ConnectMongo({
            //url:config.dbURL,
            mongoose_connection:mongoose.connections[0],
            stringify:true
        })
    }))
}

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose, fbgraph);
require('./routes/routes.js')(express, app, passport);
require('./data/upcoming_events.js')(passport, FacebookStrategy, config, mongoose, fbgraph);
require('./data/users.js')(passport, FacebookStrategy, config, mongoose, fbgraph);


app.listen(process.env.PORT || 3000, function(){
    console.log("aDating working on Port 3000");
    console.log('Mode: ' + env);
})

