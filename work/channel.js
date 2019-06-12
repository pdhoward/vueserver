

// dynamic assignment of a user channel and emitting info only to that
// client

// server side - note this uses firebase ... could be jwt
const debugSocket = debug('debug')('myAppName:socket')

const Channel = IOServer()

const CustomerChannel =
  Channel
  .of('/customer') // I am using another channel but it doesn't not matter, just showing an example
  .on('connection', async (socket)=> {
    debugSocket('CustomerChannel: Connected')
    let currentUser = null

    // I am using firebaseToken key from the query but does not matter
    // you could switch to whichever key you want as long as it is useful
    // for find your user
    if(socket.handshake.query && socket.handshake.query.firebaseToken) {
        currentUser = await firebase.auth().verifyIdToken(socket.handshake.query.firebaseToken)
        // being fancy, make sure that currentUser is not undefined or null
       // or whatever your await function could have, that is a business rule


        // Either Firebase callback or you just do some database lookup
        // using some useful information from the token
        debugSocket(`CustomerChannel:Room:Joined: ${user.email}`)
        // Whatever the callback returns me I will use some idetifier
        // and I will use it as the ID of my room
        socket.join(user.uid)
    }

    socket.on('disconnect', (reason) => {
      if(currentUser) {
        debugSocket(`CustomerChannel:Room:Leaved: ${user.email}`)
          // Same concept here I am just disconnecting the user from his own
          // This is because you can still connected to CustomerChannel
          // but not to your room, this depends of your use case
        socket.leave(currentUser.uid)
      }
    })
  })

  // client side - send query parm when you connect
io(`/customer`, {
    query: {
      token: 'whatever' // just make sure you have the information before you connect to the channel
    }
  })

// server code

// somewhere in my backend code
// I have to have the identifier of the user to be able to send him and only him messages
// so somehow I HAVE TO HAVE `user` loaded and then I will use it `uid` which was the way
// I joined the user to his room.
CustomerChannel.to(user.uid).emit('hello', { message: 'World'})