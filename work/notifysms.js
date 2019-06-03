
//Excellent model for reusable component to send sms notices
function NotifySMS(client, destination, message, callback) {
    client.sendMessage({

        to: destination,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: message

    }, callback);
}

module.exports = function() {
    // Create our Twilio client to send notifications from
    var client = require('twilio');

    // Return a function allowing specification of a phone number
    return function(destination) {

        // This function can be reused to send multiple messages to same receiver
        return function(message, callback) {
            NotifySMS(client, destination, message, callback);
        };
    };
}