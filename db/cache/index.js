
//////////////////////////////////////////////////////////
////////////         in memory cache          ///////////
////////////       auto update on get        ///////////
///////////////////////////////////////////////////////

const NodeCache = require('node-cache')

class Cache {

  constructor(ttlSeconds) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
  }

  get(key) {
    const value = this.cache.get(key)
    return Promise.resolve(value)   
  }

  set(key, result) {
    this.cache.set(key, result)
    return 'success'
  }

  del(keys) {
    this.cache.del(keys);
    return 'success'
  }

  setTtl(key, ttl) {
    return new Promise((resolve, reject) => {
      this.cache.ttl(key, ttl, (err, result) => resolve(result))
    })    
  }

  getTtl(key) {
    return new Promise((resolve, reject) => {
      this.cache.getTtl(key, (err, ttl) => resolve(ttl))      
    })
    
  }

  list() {
    return new Promise((resolve, reject) => {
      resolve(this.cache.keys())
    })
    
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key)
      }
    }
  }

  flush() {
    this.cache.flushAll()
  }
}


module.exports = Cache