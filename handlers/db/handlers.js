
//////////////////////////////////////////////////////////
//////   Create customized handlers for every new  //////
/////          streaming database events           /////
////////////////////////////////////////////////////////

const changeEmit =    require('../sockets/changeEmit')
const getSocket =         require('../../utils/getSocket')

function makeHandle() {

  function handleEvent(document) {
      return new Promise ((resolve, reject) => {        
        resolve(document)       
      })
  }
  return handleEvent
}


module.exports = function () {    
  
  const handleEvent = makeHandle()

  function handleChange(document) {

    handleEvent(document)
      .then(function (document) {         
        if (document.operationType == 'insert'){

          // retrieve the socket using utility
            let io = getSocket()
            changeEmit(io, document)
            return
        }
        if (document.operationType == 'delete') {
            console.log(`Document deleted`)
            return
        }
        console.log(JSON.stringify(document))
      })
      .catch(err => console.log(`DB Handler error > ${err}`))
  }  

  return {
    handleChange
  }
}