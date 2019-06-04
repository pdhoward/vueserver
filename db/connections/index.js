'use strict';

//////////////////////////////////////////////////////
////////   mongoose connection manager        ///////
////////////////////////////////////////////////////
const mongoose =          	require('mongoose')

const options = {
  	poolSize: 10, // Maintain up to x socket connections
    autoReconnect: true,
    autoIndex: false,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_SAFE_INTEGER
    }

const allConnections = {};

const log = console

// REFACTOR - drop connections from array on disconnect
// REFACTOR - graceful handling of errors

module.exports = (url, dbName) => {

  return new Promise((resolve, reject) => {

      const api = url + dbName;
      let conn;
      conn = allConnections[api];

      if (!conn) {
        log.info('creating new connection for ' + api);
        conn = mongoose.createConnection(api, options);
        // Log database connection events
        allConnections[api] = conn;
        conn.on('connected', () => {
          log.info('Mongoose connection open to ' + api)          
          console.log("--------Keys in AllConnections Table--------")
          for (var key in allConnections) {
              console.log(key);
            }
          resolve(conn)
        })
        conn.on('error', (err) =>  log.error('Mongoose connection error: ' + err));
        conn.on('disconnected', () => log.error('Mongoose connection disconnected'));
      }
      else {
        log.info('reusing existing connection for ' + api)
        resolve(conn)
      }
 })
}
