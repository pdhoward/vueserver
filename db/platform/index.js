
/////////////////////////////////////////////////////////
////////////         platform apis           ///////////
///////////////////////////////////////////////////////

const Cache =       require('../cache')

const ttl = 300                         // 0 means unlimited time to live
const cache = new Cache(ttl)

// capture the meter for new http transaction and return the array meter
exports.updateMeter = async (db, meter) => {  
  const collection = db.collection('meter')
  try {
    await collection.insertOne(meter)     
  } catch (e) {
    console.log(e)
  }  
  let meters = await collection.find().toArray()
  return meters
}

// retrieve configuration for network owner - (platform client)
// check first in cache for active profile, otherwise db fetch
// reset ttl if found in cache
exports.getNetworkOwner = async (db, id, mode) => {

  let cacheResult = await cache.get(id)

  if (cacheResult) {
    await cache.setTtl(id, 300)
    return cacheResult 
  }

  const collection = db.collection('clients')
  try {
    let result = await collection.findOne({
                  $and: [
                          {smsid: { $eq: id} },
                          {env: { $eq: mode}}
                        ]
                  })
    cache.set(id, result)
    return result
  } catch (e) {
    console.log(e)
  }  
}

// retrieve network owner configuration from memory
exports.getActiveNetworkOwner = async (id) => {

  let cacheResult = await cache.get(id)

  if (cacheResult) {   
    return cacheResult
  }

  return {'error': 'Platform error: network owner config not found'}

}

