
const ClientManager =             require('../handlers/sockets/ClientManager')
const ChatroomManager =           require('../handlers/sockets/ChatroomManager')
const makeHandlers =              require('../handlers/sockets/handlers')
const { g, b, gr, r, y } =        require('../console');

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

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
            handleDisconnect,
            handleTestEmit
        } = makeHandlers(client, clientManager, chatroomManager, io)

        exports.handleGetAvailableUsers

        console.log('client connected...', client.id) 
        
        // begin emitting a stream of test data to each client
        handleTestEmit()
        
        clientManager.addClient(client)

        client.on('test', (data) => {
            console.log(`Detected a message from ${client.id} `)
            console.log(data)
        })

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