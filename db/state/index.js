

// https://www.npmjs.com/package/got

/////////////////////////////////////////////////////////
////////////      state of a conversation     //////////
///////////////////////////////////////////////////////

const Cache =       require('../cache')

const ttl = 120
const cache = new Cache(ttl)

// capture the conversation 
exports.putState = async (db, obj) => {  
  const collection = db.collection('conversations')
  try {
    await collection.insertOne(obj)     
  } catch (e) {
    console.log(e)
  }    
  return 'success'
}

// retrieve a conversation. State is inferred based on cache or db sourcing
exports.getState = async (db, id) => {
 
  let cacheResult = await cache.get(id)
  if (cacheResult) {
    await cache.setTtl(id, 300)
    return cacheResult
  }

  const collection = db.collection('conversations')
  try {
    let result = await collection.findOne({ id: id })
    cache.set(id, result)
    return result
  } catch (e) {
    console.log(e)
  }
}