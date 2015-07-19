module.exports = function(passport, FacebookStrategy, config, mongoose) {


    var fbEvent = new mongoose.Schema({
        eventID: String,
        eventName: String,
        eventPic: String,
        rsvp_list: Array,
        category: String,
        time: String,
        location: String
    })


    var eventModel = mongoose.model('fbEvent', fbEvent);


    eventModel.find({}, function(err, events) {
        if (err) throw err;

        module.exports.events = events;
    })

}
