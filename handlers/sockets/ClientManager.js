const userTemplates = require('../../config/users')

module.exports = function () {
  // mapping of all connected clients
  const clients = new Map()

  function addClient(client) {
    clients.set(client.id, { client })
  }

  function registerClient(client, user) {    
    clients.set(client.id, { client, user })
    console.log("--------------this is register client------------")
    clients.forEach(c => console.log(c.user))
    }

  function removeClient(client) {
    clients.delete(client.id)
  }

  function getAvailableUsers() {
    console.log('part of experiment from inside')    

    const usersTaken = new Set(
      Array.from(clients.values())
        .filter(c => c.user)
        .map(c => c.user.name)
    )
    console.log("--------------this is array of names taken ------------")
    usersTaken.forEach(u => console.log(u))
    console.log("--------------this is names loaded in client map ------------")
    clients.forEach(c => console.log(c.user))

    return userTemplates
      .filter(u => !usersTaken.has(u.name))
  }

  function isUserAvailable(userName) {
    return getAvailableUsers().some(u => u.name === userName)
  }

  function getUserByName(userName) {
    return userTemplates.find(u => u.name === userName)
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).user
  }

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId
  }
}
