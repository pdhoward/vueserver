
//////////////////////////////////////////////////////////
//////   Create customized handlers for every new  //////
/////         socket connection - embed redis pub  /////
////////////////////////////////////////////////////////

const testemit =       require('./testemit')
const msg =            require('../../models/message')
//const sendMessage =       require('../events').publish

function makeHandleEvent(client, clientManager, chatroomManager) {

  function ensureExists(getter, rejectionMessage) {
    return new Promise(function (resolve, reject) {
      const res = getter()
      return res
        ? resolve(res)
        : reject(rejectionMessage)
    })
  }

  function ensureUserSelected(clientId) {
    return ensureExists(
      () => clientManager.getUserByClientId(clientId),
      'select user first'
    )
  }

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatroomManager.getChatroomByName(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    )
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id)
    ])
      .then(([chatroom, user]) => Promise.resolve({ chatroom, user }))
  }

  function handleEvent(chatroomName, createEntry) {
    return ensureValidChatroomAndUserSelected(chatroomName)
      .then(function ({ chatroom, user }) {
        // append event to chat history
        const entry = { user, ...createEntry() }        
        chatroom.addEntry(entry)
        // notify other clients in chatroom       
        chatroom.broadcastMessage({ chat: chatroomName, ...entry })
        return chatroom
      })
  }  
  return handleEvent
}

module.exports = function (client, clientManager, chatroomManager, io) {
  
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)   

  function handleRegister(userName, callback) {
    if (!clientManager.isUserAvailable(userName))
      return callback('user is not available')

    const user = clientManager.getUserByName(userName)
    clientManager.registerClient(client, user)

    return callback(null, user)
  }

  function handleJoin(chatroomName, callback) {
    const createEntry = () => ({ event: `joined ${chatroomName}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // add member to chatroom
        chatroom.addUser(client)

        // send chat history to client
        callback(null, chatroom.getChatHistory())
      })
      .catch(callback)
  }

  function handleLeave(chatroomName, callback) {
    const createEntry = () => ({ event: `left ${chatroomName}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // remove member from chatroom
        chatroom.removeUser(client.id)

        callback(null)
      })
      .catch(callback)
  }

  function handleMessage({ chatroomName, message } = {}, callback) {
    const createEntry = () => ({ message })

    //  FUNCTION - publish a the web socket message to redis using msg schema skeleton
    //  redis makes the message available to other platforms
    let obj = msg.obj
    obj.Body = message
    obj.From = client.id 
    obj.Context = chatroomName
    obj.Channel = 'web'
    obj.Ip = client.conn.remoteAddress
    let user = clientManager.getUserByClientId(client.id)
    let newObj = {...obj, ...user}    
    const sendMessage = require('../events/redis').publish
    sendMessage('watch', JSON.stringify(newObj))

    //  FUNCTION - determine intent --- REFACTOR TO Machine
    const {intent} = require('../functions/nlp')
    intent(message).then((response) => {
      console.log(response)
    })

    /////////////////////////////////////

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback)
  }

  function handleGetChatrooms(_, callback) {
    return callback(null, chatroomManager.serializeChatrooms())
  }

  function handleGetAvailableUsers(_, callback) {
    return callback(null, clientManager.getAvailableUsers())
  }

  // broadcast test message
  function handleTestEmit() {    
    testemit(io)
  }

  function handleDisconnect() {
    // remove user profile
    clientManager.removeClient(client)
    // remove member from all chatrooms
    chatroomManager.removeClient(client)
  }

  return {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect,
    handleTestEmit
  }
}