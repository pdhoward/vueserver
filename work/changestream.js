/* file.js */
'use strict'


module.exports = function (
    app,
    io,
    User // Collection Name
) {
    // SET WATCH ON COLLECTION 
    const changeStream = User.watch();  

    // Socket Connection  
    io.on('connection', function (socket) {
        console.log('Connection!');

        // USERS - Change
        changeStream.on('change', function(change) {
            console.log('COLLECTION CHANGED');

            User.find({}, (err, data) => {
                if (err) throw err;

                if (data) {
                    // RESEND ALL USERS
                    socket.emit('users', data);
                }
            });
        });
    });
};
/* END - file.js */