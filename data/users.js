module.exports = function(passport, FacebookStrategy, config, mongoose) {


    var dataUser = new mongoose.Schema({
        userID: String,
        profileID: String,
        fullname: String,
        profilePic: String,
        events: Array,
        age: String
    })


    var dataUserModel = mongoose.model('dataUser', dataUser);

    dataUserModel.find({}, function(err, users) {
        if (err) throw err;
        module.exports.users = users;
    })
}
