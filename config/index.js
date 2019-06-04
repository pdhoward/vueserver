'use strict';

//////////////////////////////////////////////////////////////////////////
/////////////////       server configs             //////////////////////
////////////////////////////////////////////////////////////////////////

// see spectrum their file on events ... very slick
//exports.error = function(){return require('./error.json')}
exports.platform = function(){return require('./platform.json')}
exports.network = function () { return require('./network.json')}
exports.members = function () { return require('./memberdatabookstore.json')}
