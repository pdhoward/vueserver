
/////////////////////////////////////////////////////////
////////////    network owner apis            //////////
///////////////////////////////////////////////////////

const Cache =             require('../cache')
const {conversation} =    require('../../models/conversation')
const {guest} =           require('../../models/guest')

let ttl = process.env.TTL
const cache = new Cache(ttl)

// retrieve a members configuration if registered to owners network
// else return a guest template with a random number generated for id to track conv
// update cache
exports.getMember = async (db, id) => {
  let cacheResult = await cache.get(id)
  if (cacheResult) { 
    await cache.setTtl(id, ttl)
    return cacheResult 
  }
 
  const collection = db.collection('members')
  try {
    let result = await collection.findOne({cell: id })
    if (result) {      
      cache.set(id, result)
      return result
    }
    // visitor is not found in the network owners member db. 
    //  id is set to unique channel identifier -  Return guest template
    guest.id = id
    guest.postdate = Date.now()
    cache.set(guest.id, guest)
    return guest
    
  } catch (e) {
    console.log(e)
  }
}

// retrieve a conversation: active, expired, or new  
// note the identifier is either To+From or WebID (uniquely composed)

exports.getConversation = async (db, id) => {
  let cacheResult = await cache.get(id)
  if (cacheResult) {    
    return cacheResult
  }

  const collection = db.collection('conversations')
  try {
    let result = await collection.findOne({ id: id })    
    if (result) {           
      result.ttlState = 'expired'
      return result
    } 
    // else return template with default state = new
    conversation.id = id
    conversation.timeStamp = Date.now()
    return conversation
  } catch (e) {
    console.log(e)
  }
}
// record a conversation object to mongo. Object includes response history
exports.postConversation = async (db, obj) => { 

  const collection = db.collection('conversations')
  try {
    let result = await collection.findOneAndUpdate({ id: obj.id}, {$set: obj}, { upsert: true, returnNewDocument: true})

    // set the cache object state to 'active' and reset ttl
    obj.ttlState='active'
    cache.set(obj.id, obj)
    await cache.setTtl(obj.id, ttl)

    return result
  } catch (e) {
    console.log(e)
  }
}

// record a text classifier to mongo. 
// note id is equal to the network owner 10 digit identifier (cell)
exports.postClassifier = async (db, obj) => { 

  const collection = db.collection('classifier')
  try {
    let result = await collection.findOneAndUpdate({ id: obj.id}, {$set: obj}, { upsert: true, returnNewDocument: true})

    // set the cache object state to 'active' and reset ttl
    obj.ttlState='active'
    cache.set(obj.id, obj)
    await cache.setTtl(obj.id, ttl)

    return result
  } catch (e) {
    console.log(e)
  }
}

// retrieve a classifier: active, expired, or new  
// note the identifier is ten digit identifier of network owner
exports.getClassifier = async (db, id) => {
  let cacheResult = await cache.get(id)
  if (cacheResult) {    
    return cacheResult
  }

  const collection = db.collection('classifier')
  try {
    let result = await collection.findOne({ id: id })    
    if (result) {           
      result.ttlState = 'expired'
      return result
    } 
    // else return error - no classifier found    
    result.timeStamp = Date.now()
    result.ttlState = 'error'
    result.message = `Classifier not found for ${id}`
    return result
  } catch (e) {
    console.log(e)
  }
}

// retrieve member configuration from memory
exports.getActiveMember = async (id) => { 
  let cacheResult = await cache.get(id)
  if (cacheResult) {
    return cacheResult
  }
  return { 'error': 'Platform error: member config not found in memory' }
}

// retrieve conversation from memory 
exports.getActiveConversation = async (id) => {
  let cacheResult = await cache.get(id)
  if (cacheResult) {
    return cacheResult
  }
  return { 'error': 'Platform error: conversation not found in memory' }
}

// update memory with conversation
exports.postActiveConversation = async (obj) => {
  await cache.set(obj.id, obj)
  return { 'msg': 'Success' }
}

// retrieve the network owner's component business model
// if cbm collection does not exist, return proxy to notify of error
// returns an array of all components, apis and queries
exports.getCBM = (db) => {

  return new Promise((resolve, reject) => {
    db.db.listCollections().toArray((err, collectionNames) => {
      if (err) {
        reject(err)
        return;
      }
      let cbm = collectionNames.filter(c => c.name == "cbm")
      if (cbm.length == 0) {
        let errorCBM = []
        errorCBM.push({
          "intent": "notify",
          "api": "https://randomuser.me/api/?results=1",
          "description": "notification of a platform issue",
          "env": "test",
          "_v": 0.5
        })
        resolve(errorCBM)
        return
      } else {
        // found cbm collection for network owner 
        try {
          const collection = db.collection('cbm')
          let result = collection.find({}).toArray()
          resolve(result)
          return
        } catch (e) {          
          reject(e)
        }
      }
    })

  })  
}