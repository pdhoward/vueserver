
//////////////////////////////////////////////////////////
//////   Create customized handlers for every new  //////
/////          streaming database events           /////
////////////////////////////////////////////////////////

function makeHandle() {

  function handleEvent() {
      return new Promise ((resolve, reject) => {
        console.log(`Entered DB Handle Event`)
        resolve()
      })
    
  }  
  return handleEvent
}

module.exports = function () {
  
  const handleEvent = makeHandle()

  function handleChange(document) {

    handleEvent(document)
      .then(function (document) {
        
        console.log(JSON.stringify(document))
      })
      .catch(err => console.log(`DB Handler error > ${err}`))
  }  

  return {
    handleChange
  }
}