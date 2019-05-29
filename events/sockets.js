
const ClientManager =             require('../handlers/sockets/ClientManager')
const ChatroomManager =           require('../handlers/sockets/ChatroomManager')
const makeHandlers =              require('../handlers/sockets/handlers')
const { g, b, gr, r, y } =        require('../console');

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

/*
note 'state' is an experiment to export a set of functions for handling Map()
console.log(r(`inside of events and checking out the value of state`))
console.log(state)
*/
/////////////////////////////////////////////////////
/////////////////////socket events //////////////////
////////////////////////////////////////////////////

// https://socket.io/docs/emit-cheatsheet/

const socketevents = (io) => {
    io.on('connection', function (client) {
        const {
            handleRegister,
            handleJoin,
            handleLeave,
            handleMessage,
            handleGetChatrooms,
            handleGetAvailableUsers,
            handleDisconnect
        } = makeHandlers(client, clientManager, chatroomManager)

        exports.handleGetAvailableUsers

        console.log('client connected...', client.id)        
        
        clientManager.addClient(client)

        client.on('register', handleRegister)

        client.on('join', handleJoin)

        client.on('leave', handleLeave)

        client.on('message', handleMessage)

        client.on('chatrooms', handleGetChatrooms)

        client.on('availableUsers', handleGetAvailableUsers)

        client.on('disconnect', function () {
            console.log('client disconnect...', client.id)
            handleDisconnect()
        })

        client.on('error', function (err) {
            console.log('received error from client:', client.id)
            console.log(err)
        })
    })
    console.log(g("Socket events registered"))
}

module.exports = {
    socketevents
}